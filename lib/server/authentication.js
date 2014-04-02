var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = {
  LocalStrategy: function(UsersManager) {
    passport.use(new LocalStrategy(UsersManager.authenticate));
  },

  BasicStrategy: function(UsersManager) {
    passport.use(new BasicStrategy(UsersManager.verifyToken));
  }
};

