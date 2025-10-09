const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/github/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = new User({ username: profile.username, githubId: profile.id });
          await user.save();
        }
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
