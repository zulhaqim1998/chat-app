var passport = require('passport'),
    User = require('../models/user'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local'),
    config = require('./main');

var localOptions = { usernameField: 'phone' };

var localLogin = new LocalStrategy(localOptions, function(phone, password, done) {
  User.findOne({ phone: phone }, function(err, user) {
    if(err){
      return done(err);
    }
    if(!user) {
      return done(null, false, { error: 'Your login details could not be verified. Please try again.' });
    }

    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false, { error: "Your login details could not be verified. Please try again." });
      }

      return done(null, user);
    });
  });
});

var jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload._id, function(err, user) {
    if(err){
      return done(err, false);
    }

    if(user){
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
