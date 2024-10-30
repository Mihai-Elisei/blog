import Comment from "../models/comment.model.js";

export const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return res.status(401).json("Unauthorized");
    }

    const newComment = new Comment({ content, postId, userId });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};