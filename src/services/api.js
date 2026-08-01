import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export async function login(email, password) {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function signup(name, email, password) {
  try {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Signup failed";
    throw new Error(message);
  }
}

export async function fetchAllPosts() {
    const response = await api.get("/posts");
    console.log(response.data);
    return response.data;
}

export async function fetchUserPosts(userId) {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
}

export async function createPost(authorId, content, image) {
  const response = await api.post("/posts", { authorId, content, image });
  return response.data;
}

export async function updatePost(postId, authorId, content) {
  const response = await api.put(`/posts/${postId}`, { authorId, content });
  return response.data;
}

export async function deletePost(postId, authorId) {
  const response = await api.delete(`/posts/${postId}`, { data: { authorId } });
  return response.data;
}

export async function likePost(postId) {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data.likes;
}

export async function viewPost(postId) {
  const response = await api.post(`/posts/${postId}/view`);
  return response.data.views;
}

export async function fetchLeaderboard() {
  const response = await api.get("/posts/leaderboard");
  return response.data;
}

