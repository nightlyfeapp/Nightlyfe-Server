const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../../models/User');

// Tell passport to use a new strategy
passport.use(
  new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    // Try and find user by the email
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      // unknown user
      if (!user) return done(null, false, { message: 'User is not registered' });
      // wrong password
      if (!user.validPassword(password)) return done(null, false, { message: 'Wrong password.' });
      // authentication succeeded
      return done(null, user);
    });
  }),
);
