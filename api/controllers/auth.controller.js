import User from "../models/user.model.js"; // Importing the User model to interact with the users collection in the database.
import bcryptjs from "bcryptjs"; // Importing bcryptjs to hash passwords securely.

export const signup = async (req, res) => {
  // Destructure username, email, and password from the request body.
  const { username, email, password } = req.body;

  // Check if any of the required fields (username, email, password) are missing or empty.
  if (
    !username || username === "" ||  // Check if username is not provided or is an empty string.
    !email || email === "" ||        // Check if email is not provided or is an empty string.
    !password || password === ""     // Check if password is not provided or is an empty string.
  ) {
    // If any field is missing, return a 400 (Bad Request) response with an error message.
    return res.status(400).json({ message: "All fields are required" });
  }

  // Hash the password using bcryptjs with a salt factor of 12 (a higher number makes the hash stronger but slower to compute).
  const hashedPassword = bcryptjs.hashSync(password, 12);

  // Create a new user instance using the provided username, email, and the hashed password.
  const newUser = new User({
    username,        // username from the request body.
    email,           // email from the request body.
    password: hashedPassword // store the securely hashed password.
  });

  try {
    // Save the new user to the database.
    await newUser.save();

    // If the user is saved successfully, send a success message to the client.
    res.json("Signup Successfully!");
  } catch (error) {
    // If an error occurs (e.g., database issue), send a 500 (Internal Server Error) response with the error message.
    res.status(500).json({ message: error.message });
  }
};
