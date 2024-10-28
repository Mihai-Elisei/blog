import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { updatepost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getPosts);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)

export default router;
