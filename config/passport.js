// config/passport.js
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const User = require('../models/user');

module.exports = function(passport) {
  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            // Create new user if not found
            user = await User.create({
              githubId: profile.id,
              username: profile.username,
              email: profile.emails?.[0]?.value || `${profile.username}@github.com`
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // <- correct for latest Mongoose
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
