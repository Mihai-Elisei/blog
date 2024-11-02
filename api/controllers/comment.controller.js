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

// Controller function to like a comment
export const likeComment = async (req, res, next) => {
  try {
    // Find the comment by ID and increment the likes count
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    const userIndex = comment.likes.indexOf(req.user.id); // Check if user has already liked the comment

    if (userIndex === -1) {
      comment.numberOfLikes += 1; // Increment the number of likes
      comment.likes.push(req.user.id); // Add the user's ID to the likes array
    } else {
      comment.numberOfLikes -= 1; // Decrement the number of likes
      comment.likes.splice(userIndex, 1); // Remove the user's ID from the likes array
    }

    await comment.save(); // Save the updated comment to the database
    // Send the updated comment as a JSON response
    res.status(200).json(comment);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

// Controller function to edit a comment
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId); // Find the comment by ID
    if (!comment) {
      return res.status(404).json("Comment not found"); // Return a 404 status if comment is not found
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json("Unauthorized"); // Return unauthorized status if user is not the comment author or an admin
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content }, // Update the content of the comment
      { new: true } // Return the updated comment
    );
    res.status(200).json(editedComment); // Send the updated comment as a JSON response
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

// Controller function to delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId); // Find the comment by ID
    if (!comment) {
      return res.status(404).json("Comment not found"); // Return a 404 status if comment is not found
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json("Unauthorized"); // Return unauthorized status if user is not the comment author or an admin
    }

    await Comment.findByIdAndDelete(req.params.commentId); // Delete the comment from the database
    res.status(200).json("Comment deleted successfully"); // Send a success message
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    // Check if the user is an admin
    return next(errorHandler(403, "You are not allowed to get all comments")); // Return a 403 status if user is not an admin
  try {
    const startIndex = parseInt(req.query.startIndex) || 0; // Get the startIndex query parameter
    const limit = parseInt(req.query.limit) || 9; // Get the limit query parameter
    const sortDirection = req.query.sort === "desc" ? -1 : 1; // Get the sort direction query parameter
    const comments = await Comment.find() // Find all comments
      .sort({ createdAt: sortDirection }) // Sort comments by creation date
      .skip(startIndex) // Skip comments based on the startIndex
      .limit(limit); // Limit the number of comments returned
    const totalComments = await Comment.countDocuments(); // Get the total number of comments
    const now = new Date(); // Get the current date
    const oneMonthAgo = new Date( // Calculate the date one month ago
      now.getFullYear(), // Get the current year
      now.getMonth() - 1, // Subtract one month from the current month
      now.getDate() // Get the current day
    );
    const lastMonthComments = await Comment.countDocuments({
      // Get the number of comments from the last month
      createdAt: { $gte: oneMonthAgo } // Filter comments created after the last month
    });
    res.status(200).json({ comments, totalComments, lastMonthComments }); // Send the comments as a JSON response
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};
