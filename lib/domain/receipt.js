var _ = require('lodash');
var Model = require('./model');

function Receipt(attrs) {
  Model.call(this, attrs);
}

Receipt.prototype = new Model();
Receipt.prototype.constructor = Receipt;
_.defaults(Receipt, Model);

_.extend(Receipt.prototype, {
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
  }
});

module.exports = Receipt;
