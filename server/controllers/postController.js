import { readData, writeData } from "../utils/storage.js";

function attachAuthorName(post, users) {
  const author = users.find((user) => String(user.id) === String(post.authorId));
  return {
    ...post,
    authorName: author?.name || "Unknown",
  };
}

export async function getAllPosts(req, res) {
  try {
    const data = await readData();
    const postsWithAuthors = data.posts
      .map((post) => attachAuthorName(post, data.users))
      .sort((a, b) => b.createdAt - a.createdAt);
    res.json(postsWithAuthors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
}

export async function getUserPosts(req, res) {
  try {
    const { userId } = req.params;
    const data = await readData();
    const posts = data.posts
      .filter((post) => String(post.authorId) === String(userId))
      .map((post) => attachAuthorName(post, data.users))
      .sort((a, b) => b.createdAt - a.createdAt);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
}

export async function createPost(req, res) {
  try {
    const { authorId, content, image } = req.body;

    if (!authorId || !content?.trim()) {
      return res.status(400).json({ message: "Author and content are required" });
    }

    const data = await readData();
    const newPost = {
      id: Date.now().toString(),
      authorId,
      content: content.trim(),
      image: image || null,
      likes: 0,
      views: 0,
      createdAt: Date.now(),
    };

    data.posts.unshift(newPost);
    await writeData(data);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post" });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { authorId, content } = req.body;

    if (!authorId || !content?.trim()) {
      return res.status(400).json({ message: "Author and content are required" });
    }

    const data = await readData();
    const postIndex = data.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (data.posts[postIndex].authorId !== authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    data.posts[postIndex].content = content.trim();
    await writeData(data);
    res.json(data.posts[postIndex]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post" });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const { authorId } = req.body;

    const data = await readData();
    const post = data.posts.find((item) => item.id === id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    data.posts = data.posts.filter((item) => item.id !== id);
    await writeData(data);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
}

export async function likePost(req, res) {
  try {
    const { id } = req.params;
    const data = await readData();
    const post = data.posts.find((item) => item.id === id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes += 1;
    await writeData(data);
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Failed to like post" });
  }
}

export async function viewPost(req, res) {
  try {
    const { id } = req.params;
    const data = await readData();
    const post = data.posts.find((item) => item.id === id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.views += 1;
    await writeData(data);
    res.json({ views: post.views });
  } catch (error) {
    res.status(500).json({ message: "Failed to record view" });
  }
}

export async function getLeaderboard(req, res) {
  try {
    const data = await readData();
    const usersMap = {};

    data.posts.forEach(({ authorId, likes, views }) => {
      if (!usersMap[authorId]) usersMap[authorId] = 0;
      usersMap[authorId] += likes + views;
    });

    const leaderboard = data.users
      .map((user) => ({
        id: user.id,
        name: user.name,
        engagement: usersMap[user.id] || 0,
      }))
      .sort((a, b) => b.engagement - a.engagement);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
}
