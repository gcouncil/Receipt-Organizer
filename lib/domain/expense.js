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
    folders: [],
    createdAt: null,
    updatedAt: null,
    reviewed: false,
    // references
    image: null,
    user: null
  },

  addFolder: function(id) {
    this.folders = this.folders || [];

    if (_.contains(this.folders, id)) {
      return false;
    } else {
      this.folders.push(id);
      this.folders = this.folders.sort();
      return true;
    }
  },

  removeFolder: function(id) {
    _.remove(this.folders, function(folder) {
      return folder === id;
    });
  }

});

module.exports = Expense;
