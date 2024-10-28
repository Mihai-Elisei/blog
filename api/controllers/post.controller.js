import Post from "../models/post.model.js"; // Import the Post model
import { errorHandler } from "../utils/error.js"; // Import error handler utility

// Function to create a new post
export const create = async (req, res, next) => {
  // Check if the user is an admin; if not, return an unauthorized error
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }

  // Check for required fields in the request body
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  // Generate a slug from the post title
  const slug = req.body.title
    .split(" ") // Split title by spaces
    .join("-") // Join words with hyphens
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-zA-Z0-9-]/g, ""); // Remove any non-alphanumeric characters except hyphens

  // Create a new post object with the request data, slug, and user ID
  const newPost = new Post({
    ...req.body, // Spread the rest of the request body
    slug, // Include generated slug
    userId: req.user.id, // Set userId field to the current user's ID
    author: req.user.id // Set author to the current user's ID (assuming author and userId are the same)
  });

  try {
    const savedPost = await newPost.save(); // Save the new post to the database
    res.status(201).json(savedPost); // Send a success response with the saved post data
  } catch (error) {
    next(errorHandler(500, error.message)); // Handle errors during post save and pass to error handler
  }
};
