var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function Receipt(attributes) {
  Model.call(this, attributes);
}

util.inherits(Receipt, Model);

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
    comments: null,
    tags: [],
    createdAt: null,
    updatedAt: null,
    reviewed: false,
    // references
    image: null,
    user: null
  },

  removeTag: function(id) {
    _.remove(this.tags, function(tag) {
      return tag === id;
    });
  }

});

module.exports = Receipt;
