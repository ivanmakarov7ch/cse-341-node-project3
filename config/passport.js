passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://cse-341-node-project3.onrender.com/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by githubId first
        let user = await User.findOne({ githubId: profile.id });

        // If not found, try to find by email (prevents duplicates)
        if (!user && profile.emails?.[0]?.value) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        // If still not found, create new user
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`
          });
        } else {
          // If user exists but githubId is missing, update it
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
