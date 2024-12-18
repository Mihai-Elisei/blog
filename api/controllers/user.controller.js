import { errorHandler } from "../utils/error.js"; // Import error handler utility
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import User from "../models/user.model.js"; // Import User model
import { parse } from "dotenv";

export const updateUser = async (req, res, next) => {
  // Check if the authenticated user is authorized to update their account
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user")); // Respond with a forbidden error if they are not authorized
  }

  // If a new password is provided, validate and hash it
  if (req.body.password) {
    // Check password length (must be at least 6 characters)
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters")); // Respond with a bad request error if invalid
    }
    // Hash the password before saving it to the database
    req.body.password = bcryptjs.hashSync(req.body.password, 12); // Hash the new password
  }

  // Validate the username if it is provided in the request body
  if (req.body.username) {
    // Check username length (must be between 4 and 20 characters)
    if (req.body.username.length < 4 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 4 and 20 characters")
      ); // Respond with a bad request error if invalid
    }
    // Ensure the username does not contain spaces
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces")); // Respond with a bad request error if invalid
    }
    // Verify that the username is lowercase
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase")); // Respond with a bad request error if invalid
    }
    // Ensure the username only contains letters and numbers
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      ); // Respond with a bad request error if invalid
    }
  }

  try {
    // Attempt to update the user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId, // The ID of the user to update
      {
        $set: {
          username: req.body.username, // Set the new username (if provided)
          email: req.body.email, // Set the new email (if provided)
          profilePicture: req.body.profilePicture, // Set the new profile picture (if provided)
          password: req.body.password // Set the new password (if provided)
        }
      },
      { new: true } // Return the updated user document
    );

    // Destructure the password out of the updated user object
    const { password, ...rest } = updatedUser._doc; // Exclude the password from the response
    res.status(200).json(rest); // Send the updated user information, excluding the password
  } catch (error) {
    next(error); // Handle any errors that occurred while updating the user
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user")); // Respond with a forbidden error if they are not authorized
  }
  try {
    await User.findByIdAndDelete(req.params.userId); // Attempt to delete the user from the database
    res.status(200).json("User has been deleted"); // Respond with a success message if the user was deleted
  } catch (error) {
    next(error); // Handle any errors that occurred while deleting
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("Signout successful"); // Clear the access token cookie and respond with a success message
  } catch (error) {
    next(error); // Handle any errors that occurred while signing out
  }
};

export const getusers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to view all users")); // Respond with a forbidden error if they are not authorized
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0; // Get the start index from the query parameters
    const limit = parseInt(req.query.limit) || 10; // Get the limit from the query parameters
    const sortDirection = req.query.sort === "asc" ? 1 : -1; // Get the sort direction from the query parameters

    const users = await User.find() // Fetch all users from the database
      .sort({ createdAt: sortDirection }) // Sort the users by creation date
      .skip(startIndex) // Skip the first N users
      .limit(limit); // Limit the number of users returned

    const usersWithowtPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments(); // Count the total number of users in the database
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });
    res.status(200).json({
      users: usersWithowtPassword, // Send the users array
      totalUsers, // Send the total number of users
      lastMonthUsers // Send the number of users created in the last month
    });
  } catch (error) {
    next(error); // Handle any errors that occurred while fetching users
  }
};

export const getuser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId); // Fetch the user by ID
    if (!user) {
      return next(errorHandler(404, "User not found")); // Respond with a not found error if the user does not exist
    }
    const { password, ...rest } = user._doc; // Exclude the password from the response
    res.status(200).json(rest); // Send the user information, excluding the password
  } catch (error) {
    next(error); // Handle any errors that occurred while fetching the user
  }
};
