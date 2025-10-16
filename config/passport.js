passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://cse-341-node-project3.onrender.com/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user && profile.emails?.length) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        if (user) {
          if (!user.githubId) user.githubId = profile.id;
          // Save avatar and displayName
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          user.displayName = profile.displayName || user.displayName || profile.username;
          await user.save();
          return done(null, user);
        }

        // New user
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
          displayName: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value || '',
          email
        });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
