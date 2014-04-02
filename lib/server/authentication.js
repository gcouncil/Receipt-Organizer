var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = {
  LoginStrategy: function(UsersManager) {
    passport.use(new LocalStrategy(UsersManager.authenticate));
  },

  TokenStrategy: function(UsersManager) {
    passport.use(new BasicStrategy(UsersManager.verifyToken));
  }
};

