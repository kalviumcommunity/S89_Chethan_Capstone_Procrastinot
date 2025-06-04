const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const router = express.Router();
const passport = require("passport");
require("../../config/passport"); // Load passport config
const dotenv = require("dotenv");

dotenv.config();

// 🔐 Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔹 Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Authentication failed" });

      const token = generateToken(req.user._id);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    } catch (err) {
      console.error('Google OAuth error:', err);
      res.status(500).json({ error: "Google OAuth failed" });
    }
  }
);

// 🔹 Google Login (from frontend)
router.post("/google-login", async (req, res) => {
  try {
    const { email, username, googleId } = req.body;
    
    if (!email || !googleId) {
      return res.status(400).json({ error: "Email and Google ID are required" });
    }

    // Find or create user
    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = new User({
        email,
        username,
        googleId
      });
      await user.save();
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed" });
  }
});

// 🔹 User Registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ userId: user._id, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// 🔹 User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);
    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
