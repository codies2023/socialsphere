import Navbar from "../components/NavBar";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import { validatePostContent } from "../utils/validators";
import { toast } from "react-toastify";

function PostCard({
  post,
  canEdit,
  onEdit,
  onDelete,
  onLike,
  onView,
  authorName,
  isViewing,
}) {
  // Editing state
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

  const handleSave = async () => {
    if (!validatePostContent(content.trim())) {
      toast.error("Post content must be non-empty and max 280 chars");
      return;
    }
    setSaving(true);
    try {
      await onEdit(post.id, content);
      setEditing(false);
      toast.success("Post updated");
    } catch {
      toast.error("Failed to update post");
    }
    setSaving(false);
  };

   

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition relative">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-pink-600">{authorName}</div>
        <div className="text-xs text-gray-400">
          {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>

      {editing ? (
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
      ) : (
        <p className="whitespace-pre-wrap">{post.content}</p>
      )}

      {post.image && (
        <div className="mt-3 flex justify-center">
          <img
            src={post.image}
            alt="post"
            className="w-48 h-64 object-cover rounded-md border shadow-sm"
          />
        </div>
      )}

      <div className="flex justify-between mt-3 items-center text-sm text-gray-600">
        <div className="space-x-4">
          <button
            className="hover:text-pink-600"
            onClick={() => onLike(post.id)}
            disabled={isViewing}
            title="Like Post"
          >
            ❤️ {post.likes}
          </button>
          <button
            className="hover:text-purple-600"
            onClick={() => onView(post.id)}
            disabled={isViewing}
            title="View Post"
          >
            👁️ {post.views}
          </button>
        </div>
        {canEdit && !editing && (
          <div className="space-x-2">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                setEditing(true);
                setContent(post.content);
              }}
            >
              Edit
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => onDelete(post.id)}
            >
              Delete
            </button>
          </div>
        )}
        {editing && (
          <div className="space-x-2">
            <button
              className="text-green-600 hover:underline"
              onClick={handleSave}
              disabled={saving}
            >
              Save
            </button>
            <button
              className="text-gray-600 hover:underline"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingMyPosts, setLoadingMyPosts] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [tab, setTab] = useState("all"); // all, my, leaderboard
  const [searchTerm, setSearchTerm] = useState("");

  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Fetch posts
  useEffect(() => {
    loadPosts();
  }, [tab]);

  const loadPosts = async () => {
    if (tab === "all") {
      setLoadingPosts(true);
      try {
        const allPosts = await api.fetchAllPosts();
        setPosts(allPosts);
      } catch {
        toast.error("Failed to load all posts");
      }
      setLoadingPosts(false);
    } else if (tab === "my") {
      setLoadingMyPosts(true);
      try {
        const userPosts = await api.fetchUserPosts(user.id);
        setMyPosts(userPosts);
      } catch {
        toast.error("Failed to load your posts");
      }
      setLoadingMyPosts(false);
    } else if (tab === "leaderboard") {
      setLoadingLeaderboard(true);
      try {
        const lb = await api.fetchLeaderboard();
        setLeaderboard(lb);
      } catch {
        toast.error("Failed to load leaderboard");
      }
      setLoadingLeaderboard(false);
    }
  };

  // Create Post Handler
  const handleCreatePost = async () => {
    if (!postContent.trim() || postContent.length > 280) {
      toast.error("Post content must be non-empty and max 280 chars");
      return;
    }
    setCreatingPost(true);
    try {
      const newPost = await api.createPost(user.id, postContent.trim(), postImage);
      setPostContent("");
      // Clear any active search so the newly created post is visible immediately
      setSearchTerm("");
      toast.success("Post created");
      // Optimistically update lists and also reload to ensure consistency
      if (tab === "my") {
        setMyPosts((prev) => [newPost, ...prev]);
        loadPosts();
      }
      if (tab === "all") {
        setPosts((prev) => [newPost, ...prev]);
        loadPosts();
      }
      // clear selected image
      setPostImage(null);
      setPostImagePreview(null);
    } catch {
      toast.error("Failed to create post");
    }
    setCreatingPost(false);
  };

  // Validate and normalize image to passport-like dimensions (3:4)
  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const ratio = width / height;
        const targetRatio = 3 / 4; // width/height for passport-like (3:4)
        const tolerance = 0.08;
        if (Math.abs(ratio - targetRatio) > tolerance) {
          toast.error("Image must be approximately passport aspect ratio (3:4)");
          return;
        }
        // Resize canvas to normalized passport size (300x400)
        const canvas = document.createElement("canvas");
        const targetW = 300;
        const targetH = 400;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        // Fit the source image into canvas while covering area (cover)
        const srcRatio = width / height;
        let sx = 0,
          sy = 0,
          sw = width,
          sh = height;
        if (srcRatio > targetRatio) {
          // source is wider; crop sides
          const newW = Math.round(height * targetRatio);
          sx = Math.round((width - newW) / 2);
          sw = newW;
        } else if (srcRatio < targetRatio) {
          // source is taller; crop top/bottom
          const newH = Math.round(width / targetRatio);
          sy = Math.round((height - newH) / 2);
          sh = newH;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
        const normalizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPostImage(normalizedDataUrl);
        setPostImagePreview(normalizedDataUrl);
      };
      img.onerror = () => toast.error("Failed to read image file");
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // My Posts Handlers

  const handleEditPost = async (postId, content) => {
    try {
      const updated = await api.updatePost(postId, user.id, content);
      setMyPosts((prev) =>
        prev.map((p) => (p.id === postId ? updated : p))
      );
      if (tab === "all") loadPosts();
      if (tab === "my") loadPosts();
    } catch (error) {
      toast.error(error.message || "Error updating post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.deletePost(postId, user.id);
      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted");
      if (tab === "all") loadPosts();
    } catch (error) {
      toast.error(error.message || "Error deleting post");
    }
  };

  // Like and View handlers

  const handleLike = async (postId) => {
    try {
      const newLikes = await api.likePost(postId);
      updatePostStats(postId, { likes: newLikes });
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleView = async (postId) => {
    try {
      const newViews = await api.viewPost(postId);
      updatePostStats(postId, { views: newViews });
    } catch {
      toast.error("Failed to view post");
    }
  };

  // Update post likes/views in lists
  const updatePostStats = (postId, data) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...data } : p))
    );
    setMyPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...data } : p))
    );
  };

  // Helper to get author name - from users localStorage
  const getAuthorName = (authorId) => {
    const users = JSON.parse(localStorage.getItem("sm_users") || "[]");
    const author = users.find((u) => u.id === authorId);
    return author ? author.name : "Unknown";
  };

  const filterPosts = (postList) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return postList;
    return postList.filter((post) =>
      `${post.content} ${getAuthorName(post.authorId)}`.toLowerCase().includes(query)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-yellow-100">
      <Navbar
        user={user}
        logout={logout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setTab={setTab}
        tab={tab}
      />

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:py-10">
        {tab === "all" && (
          <>
            {loadingPosts && <p className="text-center text-pink-600">Loading posts...</p>}
            {!loadingPosts && posts.length === 0 && (
              <p className="text-center text-pink-700">No posts available.</p>
            )}
            {!loadingPosts &&
              filterPosts(posts).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canEdit={false}
                  authorName={getAuthorName(post.authorId)}
                  onLike={handleLike}
                  onView={handleView}
                />
              ))}
          </>
        )}

        {tab === "my" && (
          <>
            {/* Create Post */}
            <div className="mb-6">
              <textarea
                className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                placeholder="What's on your mind?"
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={280}
              />
              <div className="flex items-center mt-2 space-x-4">
                <label className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      handleImageFile(file);
                    }}
                  />
                  <span className="text-sm text-gray-600">Choose image</span>
                </label>
                {postImagePreview && (
                  <div className="ml-2 relative">
                    <img src={postImagePreview} alt="preview" className="w-24 h-32 object-cover rounded-md border" />
                    <button
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow text-red-600 px-1"
                      onClick={() => {
                        setPostImage(null);
                        setPostImagePreview(null);
                      }}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex-1 flex justify-end items-center">
                <span className="text-sm text-gray-500">
                  {postContent.length}/280
                </span>
                <button
                  onClick={handleCreatePost}
                  disabled={creatingPost}
                  className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-md px-4 py-2 shadow-lg hover:brightness-110 transition disabled:opacity-50"
                >
                  {creatingPost ? "Posting..." : "Post"}
                </button>
                </div>
              </div>
            </div>

            {loadingMyPosts && <p className="text-center text-pink-600">Loading your posts...</p>}
            {!loadingMyPosts && myPosts.length === 0 && (
              <p className="text-center text-pink-700">You have not created any posts.</p>
            )}
            {!loadingMyPosts &&
              filterPosts(myPosts).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canEdit={true}
                  authorName={user.name}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  onLike={handleLike}
                  onView={handleView}
                />
              ))}
          </>
        )}

        {tab === "leaderboard" && (
          <div className="overflow-x-auto rounded-lg">
            {loadingLeaderboard && <p className="text-center text-pink-600">Loading leaderboard...</p>}
            {!loadingLeaderboard && leaderboard.length === 0 && (
              <p className="text-center text-pink-700">No data for leaderboard yet.</p>
            )}
            {!loadingLeaderboard && leaderboard.length > 0 && (
              <table className="w-full table-auto border-collapse rounded-lg overflow-hidden shadow-md">
                <thead>
                  <tr className="bg-pink-400 text-white text-left">
                    <th className="px-6 py-3">Rank</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Engagement Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={idx % 2 === 0 ? "bg-pink-100" : "bg-pink-50"}
                    >
                      <td className="px-6 py-3 font-semibold">{idx + 1}</td>
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3 font-bold">{user.engagement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
      <footer className="text-center py-4 text-sm text-gray-600">
        <div>© {new Date().getFullYear()} SocialSphere. All rights reserved.</div>
        <div>Made with ❤️ by Shakya</div>
      </footer>
    </div>
  );
}
