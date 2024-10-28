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

// Controller function to retrieve posts based on various query parameters
export const getPosts = async (req, res, next) => {
  try {
    // Extract pagination and sorting parameters from the request query
    const startIndex = parseInt(req.query.startIndex) || 0; // Start index for pagination (default is 0)
    const limit = parseInt(req.query.limit) || 9; // Limit for number of posts per page (default is 9)
    const sortDirection = req.query.order === "asc" ? 1 : -1; // Determine sort order: ascending (1) or descending (-1)

    // Build the filter criteria for fetching posts, including dynamic conditions based on query parameters
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // Filter by userId if provided
      ...(req.query.category && { category: req.query.category }), // Filter by category if provided
      ...(req.query.slug && { slug: req.query.slug }), // Filter by slug if provided
      ...(req.query.postId && { _id: req.query.postId }), // Filter by postId if provided
      ...(req.query.searchTerm && {
        // Search in title and content if searchTerm is provided
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } }, // Case-insensitive search in title
          { content: { $regex: req.query.searchTerm, $options: "i" } } // Case-insensitive search in content
        ]
      })
    })
      .sort({ updatedAt: sortDirection }) // Sort posts by the updatedAt field
      .skip(startIndex) // Skip the first 'startIndex' posts for pagination
      .limit(limit); // Limit the result to 'limit' number of posts

    // Count total number of posts in the database (could also consider using relevant filters)
    const totalPosts = await Post.countDocuments();

    // Get the current date
    const now = new Date();

    // Create a date object for one month ago
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // Fetch posts that were created in the last month
    const lastMonthPosts = await Post.find({
      createdAt: { $gte: oneMonthAgo } // Filter for posts created since one month ago
    });

    // Respond with status 200 and the retrieved data: posts, total post count, and last month posts
    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    // Handle any errors that occur within the try block
    next(errorHandler(500, error.message)); // Call the next middleware with an error
  }
};

// Controller function to delete a post
export const deletePost = async (req, res, next) => {
  // Check if the user making the request is an admin and if the user ID in the request matches the ID in the parameters
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    // If the user is not authorized, call the error handler with a 401 Unauthorized status
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    // Attempt to find and delete the post with the specified post ID from the request parameters
    await Post.findByIdAndDelete(req.params.postId);
    // If successful, respond with a 200 HTTP status and a success message
    res.status(200).json("Post has been deleted");
  } catch (error) {
    // Catch any errors that occur during the deletion process
    // Pass the error to the error handler with a 500 Internal Server Error status
    next(errorHandler(500, error.message));
  }
};
