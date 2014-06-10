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
  token: undefined,
  settings: {
    categories: [
      'Airline',
      'Car Rental',
      'Convenience Store',
      'Entertainment',
      'Fuel/Auto',
      'General Retail',
      'Grocery',
      'Lodging/Hotel',
      'Meals/Restaurant',
      'Post/Shipping',
      'Software/Hardware',
      'Taxi',
      'Telecom',
      'Transportation',
      'Utility'
    ]
  }
});

module.exports = User;
