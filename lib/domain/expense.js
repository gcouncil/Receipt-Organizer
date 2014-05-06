var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function Expense(attributes) {
  Model.call(this, attributes);
}

util.inherits(Expense, Model);

_.extend(Expense.prototype, {
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

  addTag: function(id) {
    this.tags = this.tags || [];

    if (_.contains(this.tags, id)) {
      return false;
    } else {
      this.tags.push(id);
      this.tags = this.tags.sort();
      return true;
    }
  },

  removeTag: function(id) {
    _.remove(this.tags, function(tag) {
      return tag === id;
    });
  }

});

module.exports = Expense;
