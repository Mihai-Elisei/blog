import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { signout } from "../controllers/user.controller.js";
import { getusers } from "../controllers/user.controller.js";
import { getuser } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);

router.get("/getusers", verifyToken, getusers)
router.get("/:userId", getuser)

export default router;
