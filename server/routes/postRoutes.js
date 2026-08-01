import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getLeaderboard,
  getUserPosts,
  likePost,
  updatePost,
  viewPost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/leaderboard", getLeaderboard);
router.get("/user/:userId", getUserPosts);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/like", likePost);
router.post("/:id/view", viewPost);

export default router;
