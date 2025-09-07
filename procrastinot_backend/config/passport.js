// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

// Validate required environment variables
const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Determine the server base URL for OAuth callback
const serverBaseUrl = process.env.SERVER_URL 
  || process.env.RENDER_EXTERNAL_URL 
  || 'https://s89-chethan-capstone-procrastinot-1.onrender.com';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${serverBaseUrl}/api/users/google/callback`,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          // If user exists but doesn't have googleId (registered via email)
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          // Create new user with unique username
          const rawName = profile.displayName || profile.emails?.[0]?.value?.split('@')?.[0] || 'user';
          const baseUsername = (rawName
            .toString()
            .replace(/[^a-zA-Z0-9_-]/g, '')
            .substring(0, 30)) || `user${Date.now()}`;

          let candidateUsername = baseUsername;
          let suffix = 0;
          // Ensure username uniqueness against existing users
          // Try up to 10 variants quickly
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const clash = await User.findOne({ username: candidateUsername });
            if (!clash) break;
            suffix += 1;
            const suffixStr = String(suffix);
            candidateUsername = (baseUsername.substring(0, Math.max(1, 30 - suffixStr.length)) + suffixStr);
          }

          user = await User.create({
            googleId: profile.id,
            username: candidateUsername,
            email: profile.emails[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error('Google strategy error:', err);
        return done(err, null);
      }
    }
  )
);

// Serialization not needed for JWT, but kept for compatibility
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
