const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const router = express.Router();
const passport = require("passport");
require("../../config/passport"); // Load passport config
const dotenv = require("dotenv");
const { authLimiter } = require("../../middleware/rateLimiter");

dotenv.config();

// Helper function to validate JWT_SECRET
const validateJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
};

// 🔐 Generate JWT Token
const generateToken = (userId) => {
  validateJWTSecret();
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // 7 days - long enough for persistent sessions
  });
};

// 🔹 Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Authentication failed" });

      const token = generateToken(req.user._id);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    } catch (err) {
      console.error('Google OAuth error:', err);
      res.status(500).json({ message: "Google OAuth failed" });
    }
  }
);

// 🔹 Google Login (from frontend)
router.post("/google-login", authLimiter, async (req, res) => {
  try {
    const { email, username, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Email and Google ID are required" });
    }

    // Sanitize username for database validation (remove spaces, special chars)
    const sanitizedUsername = (username || email.split('@')[0])
      .replace(/[^a-zA-Z0-9_-]/g, '') // Remove invalid characters
      .substring(0, 30); // Ensure max length

    // Find or create user
    let user = await User.findOne({
      $or: [
        { googleId: googleId },
        { email: email }
      ]
    });

    if (!user) {
      // Create new user
      user = new User({
        email,
        username: sanitizedUsername,
        googleId
      });
      await user.save();
    } else if (!user.googleId) {
      // Link existing email account with Google
      user.googleId = googleId;
      await user.save();
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
});

// 🔹 User Registration
router.post("/register", authLimiter, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user by email or username
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ userId: user._id, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// 🔹 User Login
router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user has a password (not Google-only account)
    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google or reset your password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// 🔄 Refresh Token
router.post("/refresh-token", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Verify the current token (even if expired, we can still decode it)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // If token is expired, we can still decode it to check the user
      if (err.name === 'TokenExpiredError') {
        decoded = jwt.decode(token);
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    // Verify the user ID matches the token
    if (decoded.id !== userId) {
      return res.status(401).json({ message: "Token user mismatch" });
    }

    // Check if user still exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new token
    const newToken = generateToken(userId);

    res.json({
      token: newToken,
      message: "Token refreshed successfully"
    });

  } catch (err) {
    console.error("Token refresh error:", err);
    res.status(500).json({ message: "Token refresh failed" });
  }
});

module.exports = router;
