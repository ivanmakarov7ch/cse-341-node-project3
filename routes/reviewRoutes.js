const passport = require('passport');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  reviewController.createReview
);
