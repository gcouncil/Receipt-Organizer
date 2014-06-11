var _ = require('lodash');
var util = require('util');
var Model = require('./model');
var Item = require('./item');

function Expense(attributes) {
  Item.apply(this, arguments);
}

util.inherits(Expense, Item);

Model.addAttributes(Expense, {
  receipt: undefined
});

Expense.buildFromReceipt = function(receipt) {
  return new Expense({
    receipt: receipt.id,
    reviewed: receipt.reviewed,
    fields: _.transform(receipt.fields, function(fields, field) {
      if (_.contains(['vendor', 'date', 'paymentType', 'city', 'state'], field.name)) {
        fields.push(field.clone());
      }
    })
  });
};

Item.defineType('expense', Expense);
module.exports = Expense;
