var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function User(attrs) {
  this.reset(attrs);
}

util.inherits(User, Model);

_.extend(User.prototype, {
  defaults: {
    id: undefined,
    email: null,
    password: undefined,
    passwordHash: undefined,
    token: undefined
  }
});

module.exports = User;
