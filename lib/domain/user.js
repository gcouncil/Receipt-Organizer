var util = require('util');
var Model = require('./model');

function User(attributes) {
  Model.apply(this, arguments);
}

util.inherits(User, Model);

Model.addAttributes(User, {
  id: undefined,
  email: null,
  password: undefined,
  passwordHash: undefined,
  token: undefined
});

module.exports = User;
