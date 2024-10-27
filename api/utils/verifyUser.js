import jwt from "jsonwebtoken"; // Import jsonwebtoken library for token verification
import { errorHandler } from "./error.js"; // Import the error handler utility

// Middleware function to verify JSON Web Tokens (JWT)
export const verifyToken = (req, res, next) => {
  // Retrieve the access token from cookies
  const token = req.cookies.access_token;

  // Check if the token exists; if not, respond with an unauthorized error
  if (!token) {
    return next(errorHandler(401, "Unauthorized")); // Respond with a 401 Unauthorized error
  }

  // Verify the token using the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    // If there's an error during verification, respond with an unauthorized error
    if (err) {
      return next(errorHandler(401, "Unauthorized")); // Respond with a 401 Unauthorized error
    }

    // If the token is valid, attach the decoded user information to the request object
    req.user = user; // Store the user information retrieved from the token in request object

    // Call the next middleware function
    next(); // Proceed to the next middleware/route handler
  });
};
