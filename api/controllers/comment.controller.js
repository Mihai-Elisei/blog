import Comment from "../models/comment.model.js";

// Controller function to create a new comment
export const createComment = async (req, res) => {
  try {
    // Destructure required fields from request body
    const { content, postId, userId } = req.body;

    // Verify that the userId in the request body matches the authenticated user's ID
    if (userId !== req.user.id) {
      return res.status(401).json("Unauthorized"); // Return unauthorized status if IDs don't match
    }

    // Create a new comment document using the Comment model
    const newComment = new Comment({ content, postId, userId });
    await newComment.save(); // Save the new comment to the database

    // Send the created comment as a JSON response
    res.status(200).json(newComment);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

// Controller function to retrieve comments for a specific post
export const getPostComments = async (req, res) => {
  try {
    // Find comments for the specified postId and sort by newest first
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1
    });

    // Send the comments as a JSON response
    res.status(200).json(comments);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};
