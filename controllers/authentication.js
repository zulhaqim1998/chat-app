"use strict";

var jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    User = require('../models/user'),
    config = require('../config/main');

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    username: request.username,
    phone: request.phone
  //  role: request.role,
  };
}


// Login Route
//========================================
exports.login = function(req, res, next) {

  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
};

//========================================
// Registration Route
//========================================
exports.register = function(req, res, next) {
  console.log('register route triggered');
  // Check for registration errors
  var phone = req.body.phone;
  var username = req.body.username;
  var password = req.body.password;

  // Return error if no phone number provided
  if (!phone) {
    return res.status(422).send({ error: 'Please enter your phone number.'});
  }

  // Return error if full name not provided
  if (!username) {
    return res.status(422).send({ error: 'Please enter username.'});
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'Please enter a password.' });
  }

  User.findOne({ phone: phone }, function(err, existingUser) {
      if(err){
        return next(err);
      }

      // If user is not unique, return error
      if(existingUser){
        return res.status(422).send({ error: 'That phone number is already in use.' });
      }

      // If the phone number is unique and password was provided, create account
      let user = new User({
        phone: phone,
        password: password,
        username: username
      });

      user.save(function(err, user) {
        if(err){
          return next(err);
        }

        // Respond with JWT if user was created

        let userInfo = setUserInfo(user);

        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
        });
      });
  });
};
