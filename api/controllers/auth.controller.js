import User from "../models/user.model.js"; // Import User model to interact with the database.
import bcryptjs from "bcryptjs"; // Import bcryptjs for securely hashing passwords.
import { errorHandler } from "../utils/error.js"; // Import custom error handler utility.
import jwt from "jsonwebtoken"; // Import JWT for creating tokens.

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate that required fields are provided and not empty.
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  // Hash the password securely using bcrypt with a salt factor of 12.
  const hashedPassword = bcryptjs.hashSync(password, 12);

  // Create a new user instance with the hashed password.
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    // Save the new user to the database.
    await newUser.save();
    res.json("Signup Successfully!"); // Send a success message on successful signup.
  } catch (error) {
    next(error); // Pass any errors to error handling middleware.
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that email and password are provided and not empty.
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Find the user in the database by email.
    const validUser = await User.findOne({ email });

    // If user does not exist, return an error.
    if (!validUser) {
      return next(errorHandler(404, "Invalid credentials"));
    }

    // Check if the provided password matches the hashed password.
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid credentials"));
    }

    // Generate JWT token with user ID as payload.
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h"
      }
    );

    // Remove password from user object before sending the response.
    const { password: pass, ...rest } = validUser._doc;

    // Send the token as an HTTP-only cookie and return user data excluding password.
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true
      })
      .json(rest);
  } catch (error) {
    next(error); // Pass any errors to error handling middleware.
  }
};

export const google = async (req, res, next) => {
  const { email, name, photoURL } = req.body;

  console.log("Received Google auth data:", { email, name, photoURL });

  try {
    // Check if a user with the given email already exists.
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Set secure only in production
          sameSite: "Strict"
        })
        .json(rest);
    } else {
      // Generate a random password and hash it
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);

      // Create a new user with the received Google information
      user = new User({
        username:
          name.toLowerCase().replace(/\s+/g, "") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: photoURL
      });

      await user.save();

      // Generate token and return response
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict"
        })
        .json(rest);
    }
  } catch (error) {
    console.error("Error in google authentication route:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
