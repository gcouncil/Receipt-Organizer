var util = require('util');
var Model = require('./model');
var Item = require('./item');

function Expense(attributes) {
  Item.apply(this, arguments);
}

util.inherits(Expense, Item);

Model.addAttributes(Expense, {
  image: null
});

module.exports = Expense;
