//middleware for authentication
//middleware to verify JWT token and attach user to request object
//middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// Import environment variables
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
// Check if authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
// Verify token and attach user to request object
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};
//export the middleware function
module.exports = authMiddleware;
