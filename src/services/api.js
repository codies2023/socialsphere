// Mock API simulating backend logic with delays and localStorage

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Storage keys
const USERS_KEY = "sm_users";
const POSTS_KEY = "sm_posts";

// Helpers

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getPosts() {
  return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// User API

export async function login(email, password) {
  await delay(500);
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password");
  return { id: user.id, name: user.name, email: user.email };
}

export async function signup(name, email, password) {
  await delay(700);
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already registered");
  }
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
  };
  users.push(newUser);
  saveUsers(users);
  return { id: newUser.id, name: newUser.name, email: newUser.email };
}

// Posts API

export async function fetchAllPosts() {
  await delay(700);
  return getPosts();
}

export async function fetchUserPosts(userId) {
  await delay(600);
  const posts = getPosts();
  return posts.filter((p) => p.authorId === userId);
}

export async function createPost(authorId, content, image) {
  await delay(500);
  const posts = getPosts();
  const newPost = {
    id: Date.now().toString(),
    authorId,
    content,
    image: image || null,
    likes: 0,
    views: 0,
    createdAt: Date.now(),
  };
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export async function updatePost(postId, authorId, content) {
  await delay(500);
  let posts = getPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) throw new Error("Post not found");
  if (posts[index].authorId !== authorId) throw new Error("Unauthorized");
  posts[index].content = content;
  savePosts(posts);
  return posts[index];
}

export async function deletePost(postId, authorId) {
  await delay(500);
  let posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post not found");
  if (post.authorId !== authorId) throw new Error("Unauthorized");
  posts = posts.filter((p) => p.id !== postId);
  savePosts(posts);
}

export async function likePost(postId) {
  await delay(300);
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post not found");
  post.likes++;
  savePosts(posts);
  return post.likes;
}

export async function viewPost(postId) {
  await delay(200);
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post not found");
  post.views++;
  savePosts(posts);
  return post.views;
}

// Leaderboard computation
export async function fetchLeaderboard() {
  await delay(700);
  const posts = getPosts();
  const usersMap = {};
  posts.forEach(({ authorId, likes, views }) => {
    if (!usersMap[authorId]) usersMap[authorId] = 0;
    usersMap[authorId] += likes + views;
  });
  const users = getUsers();
  const leaderboard = users
    .map((u) => ({
      id: u.id,
      name: u.name,
      engagement: usersMap[u.id] || 0,
    }))
    .sort((a, b) => b.engagement - a.engagement);
  return leaderboard;
}
