var _ = require('lodash');
var Model = require('./model');

function Receipt(attributes) {
  Model.call(this, attributes);
}

Receipt.prototype = _.create(Model.prototype, {
  constructor: Receipt,

  defaults: {
    id: undefined,
    date: null,
    vendor: null,
    paymentType: null,
    category: null,
    city: null,
    state: null,
    tax: null,
    additionalTax: null,
    total: null,
    tip: null,
    taxCategory: null,
    businessPurpose: null,
    reimbursable: false,
    billable: false,
    comments: null
  },

  associations: {
    user: null,
    imageSet: null
  }
});

module.exports = Receipt;
