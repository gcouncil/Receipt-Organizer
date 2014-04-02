var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TokenStrategy = require('passport-token').Strategy;

var tokenOptions = {
  usernameHeader: 'username',
  tokenHeader: 'token'
};

module.exports = {
  LoginStrategy: function(UsersManager) {
    passport.use(new LocalStrategy(UsersManager.authenticate));
  },

  TokenStrategy: function(UsersManager) {
    passport.use(new TokenStrategy(tokenOptions, UsersManager.verifyToken));
  }
};

