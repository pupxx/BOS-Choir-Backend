const bcrypt = require('bcrypt-as-promised');
const passport = require('passport');
const auth = require('../models/auth/mdl_signup');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Create a passport local strategy
// Create the local options for the strategy by telling the fieldname we are  using email.
// Check that user exists by checking email.
// If no user found call done with null, false.
// If user found, compare passwords using bcrypt.compare
// If password does not match email, then call done with null, false.
// If match, call done with null, user.

const localOptions = { usernameField: 'email' };
const localSignin = new LocalStrategy(localOptions, (email, password, done) => {
  auth.checkForUser(email).then(user => {
    if (!user) {
      return done(null, false);
    }
    const signedInUser = user;
    return bcrypt
      .compare(password, signedInUser.hashed_password)
      .then(match => {
        if (!match) {
          return done(null, false);
        }
        delete signedInUser.hashed_password;

        return done(null, signedInUser);
      })
      .catch(bcrypt.MISMATCH_ERROR, () => {
        throw { status: 400, message: 'Bad email or password' };
      })
      .catch(err => done(err));
  });
});

passport.use(localSignin);