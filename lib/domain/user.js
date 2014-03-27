var _ = require('lodash');
var Model = require('./model');

function User(attrs) {
  this.reset(attrs);
}

User.prototype = new Model();
User.prototype.constructor = User;
_.defaults(User, Model);

_.extend(User.prototype, {
  defaults: {
    id: undefined,
    email: null,
    password: undefined
  }

  // valid: {
    // TODO: validate format (or email confirmation?) and uniqueness of email address
  // }

});

module.exports = User;
