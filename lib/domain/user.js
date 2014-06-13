var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function User(attributes) {
  Model.apply(this, arguments);

  // Reset settings if it's not an object (database defaults it to null)
  if (!_.isObject(this.settings)) {
    this.settings = this.defaults.settings;
  }

  // Ensure all settings keys exist
  _.defaults(this.settings, this.defaults.settings);
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
      { name: 'Airline' },
      { name: 'Car Rental' },
      { name: 'Convenience Store' },
      { name: 'Entertainment' },
      { name: 'Fuel/Auto' },
      { name: 'General Retail' },
      { name: 'Grocery' },
      { name: 'Lodging/Hotel' },
      { name: 'Meals/Restaurant' },
      { name: 'Post/Shipping' },
      { name: 'Software/Hardware' },
      { name: 'Taxi' },
      { name: 'Telecom' },
      { name: 'Transportation' },
      { name: 'Utility' }
    ],
    fields: [
      { name: 'Custom Field 1', selected: false },
      { name: 'Custom Field 2', selected: false },
      { name: 'Custom Field 3', selected: false },
      { name: 'Custom Field 4', selected: false },
      { name: 'Custom Field 5', selected: false }
    ]
  }
});

module.exports = User;
