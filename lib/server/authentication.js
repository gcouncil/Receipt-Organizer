var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(UsersManager) {
  passport.use(new LocalStrategy(UsersManager.authenticate));
};
