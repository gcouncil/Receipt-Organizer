var util = require('util');
var Model = require('./model');
var Item = require('./item');

function Receipt(attributes) {
  Item.apply(this, arguments);
}

util.inherits(Receipt, Item);

Model.addAttributes(Receipt, {
  image: undefined
});

Item.defineType('receipt', Receipt);
module.exports = Receipt;
