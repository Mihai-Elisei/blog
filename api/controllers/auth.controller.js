import User from "../models/user.model.js"; // Importing the User model to interact with the users collection in the database.
import bcryptjs from "bcryptjs"; // Importing bcryptjs to hash passwords securely.
import { errorHandler } from "../utils/error.js"; // Importing the custom error handler utility.
import jwt from "jsonwebtoken"; // Importing JSON Web Token for creating tokens.

export const signup = async (req, res, next) => {
  // Destructure username, email, and password from the request body.
  const { username, email, password } = req.body;

  // Check if any of the required fields (username, email, password) are missing or empty.
  if (
    !username ||
    username === "" || // Check if username is not provided or is an empty string.
    !email ||
    email === "" || // Check if email is not provided or is an empty string.
    !password ||
    password === "" // Check if password is not provided or is an empty string.
  ) {
    // If any field is missing, pass a 400 error to the error handling middleware using 'next'.
    next(errorHandler(400, "All fields are required"));
    return; // Ensure the function stops execution here after handling the error.
  }

  // Hash the password using bcryptjs with a salt factor of 12 (a higher number makes the hash stronger but slower to compute).
  const hashedPassword = bcryptjs.hashSync(password, 12);

  // Create a new user instance using the provided username, email, and the hashed password.
  const newUser = new User({
    username, // Username from the request body.
    email, // Email from the request body.
    password: hashedPassword // Store the securely hashed password.
  });

  try {
    // Save the new user to the database.
    await newUser.save();

    // If the user is saved successfully, send a success message to the client.
    res.json("Signup Successfully!");
  } catch (error) {
    // If an error occurs (e.g., database issue), pass it to the error handling middleware with 'next'.
    next(error);
  }
};

export const signin = async (req, res, next) => {
  // Destructure email and password from the request body for sign-in.
  const { email, password } = req.body;

  // Validate that both email and password are provided and not empty.
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required")); // Pass error to the error handler.
    return; // Stop execution after handling the error.
  }

  try {
    // Find the user in the database by email.
    const validUser = await User.findOne({ email });

    // Check if validUser exists before comparing passwords.
    if (!validUser) {
      return next(errorHandler(404, "Invalid credentials")); // Handle case where user is not found.
    }

    // Compare the provided password with the hashed password stored in the database.
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    // Check if the password matches.
    if (!validPassword) {
      return next(errorHandler(404, "Invalid credentials")); // Pass error if password does not match.
    }

    // Create a JWT token for the authenticated user.
    const token = jwt.sign(
      {
        id: validUser._id // Storing user ID in the token payload.
      },
      process.env.JWT_SECRET_KEY // The secret key for signing the token.
    );

    // Remove the password from the user object before sending the response.
    const { password: pass, ...rest } = validUser._doc;

    // Send the token as a cookie and return the user data as a response.
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true // The cookie will be accessible only by the web server.
      })
      .json(rest); // Send the authenticated user data back as JSON, excluding the password.
  } catch (error) {
    // If an error occurs during the sign-in process, pass it to the error handler.
    next(error);
  }
};
