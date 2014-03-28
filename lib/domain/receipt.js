var _ = require('lodash');

function Receipt(attrs) {
  // Ensure some type of id
  this.reset(attrs);
  // this.id = this.id || _.uniqueId('receipt');
}

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
    image: undefined
  },

  valid: function() {
    return true;
  },

  toJSON: function() {
    return _.pick(this, _.keys(this.defaults));
  },

  clone: function() {
    return new this.constructor(this.toJSON());
  },

  reset: function(attrs) {
    _.extend(this, this.defaults, _.pick(attrs, _.keys(this.defaults)));
  }
});

module.exports = Receipt;
