var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function User(attrs) {
  this.reset(attrs);
}

util.inherits(User, model);

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
