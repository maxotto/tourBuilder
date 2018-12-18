var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user-model');

passport.use(new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback : true
  },
  function(req, username, password, done) {
    // console.log({username}, {password});
    return User.findOne({
      $or: [
        { "username": username},
        { "email": username}
      ]
    }, function(err, user) {

    });
    if(username ===  'andrey'){
      if(password === '12345'){
        return done(null, {username:'ANDREY', id: 1});
      } else {
        return done(null, false);
      }
    } else {
      return done('Not Andrey');
    }
  }
));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = function() {

  router.post('/',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res, next) {
    // console.log(req.body);
    res.send({
      success: false,
      message: 'Login post done',
    });
  });

  return router;
};