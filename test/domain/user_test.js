require('./test-helper');

var domain = require('epson-receipts/domain');
var expect = require('chai').expect;

describe('user domain object', function() {
  it('should add default settings if user doesn\'t have any', function() {
    var ctx = this;
    ctx.user = new domain.User({ settings: null });
    expect(ctx.user.settings).to.deep.equal({
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
    });
  });
});
