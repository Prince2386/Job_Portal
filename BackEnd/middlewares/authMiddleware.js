import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT token and protect routes
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the headers and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user associated with the token (excluding the password)
      // Note: adjust 'decoded.id' to 'decoded.userId' if your token generation uses 'userId'
      req.user = await User.findById(decoded.userId || decoded.id).select("-password");

      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed or expired",
      });
    }
  }

  // If no token is found at all
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};