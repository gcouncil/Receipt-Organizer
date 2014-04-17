var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function(UsersManager) {
  passport.use(new LocalStrategy(UsersManager.authenticate));
  passport.use(new BearerStrategy(UsersManager.verifyToken));
};

