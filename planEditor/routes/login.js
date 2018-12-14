var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log({username}, {password});
    if(username ===  'andrey'){
      if(password === '12345'){
        return done(null, 'ANDREY');
      } else {
        return done(null, false);
      }
    } else {
      return done('Not Andrey');
    }
  }
));

module.exports = function() {

  router.post('/',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res, next) {
    console.log(req.body);
    res.send({
      success: false,
      message: 'Login post done',
    });
  });

  return router;
};