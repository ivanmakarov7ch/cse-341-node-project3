const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

module.exports = function () {
  // ensure env present
  const callback = process.env.GITHUB_CALLBACK_URL || 'https://cse-341-node-project3.onrender.com/auth/github/callback';

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: callback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find by githubId first
          let user = await User.findOne({ githubId: profile.id });

          // Fallback: find by email if available
          if (!user && profile.emails?.length) {
            user = await User.findOne({ email: profile.emails[0].value });
          }

          // If found: ensure githubId set
          if (user) {
            if (!user.githubId) {
              user.githubId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // New user — ensure unique username
          let usernameBase = profile.username || profile.displayName || `user${profile.id}`;
          let username = usernameBase;
          let counter = 0;
          while (await User.findOne({ username })) {
            counter++;
            username = `${usernameBase}${counter}`;
          }

          const email = profile.emails?.[0]?.value || `${username}@github.com`;

          user = await User.create({
            githubId: profile.id,
            username,
            email
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
