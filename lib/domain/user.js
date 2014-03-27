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
    createdAt: null,
    updatedAt: null,
    email: null,
    passwordHash: null,
  }

  // valid: {
    // TODO: validate format (or email confirmation?) and uniqueness of email address
  // }

});

module.exports = User;
