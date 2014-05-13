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

Item.defineType('expense', Expense);
module.exports = Expense;
