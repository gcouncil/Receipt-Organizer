var _ = require('lodash');
var util = require('util');
var Field = require('./field');
var Model = require('./model');
var Item = require('./item');

function Receipt(attributes) {
  Item.apply(this, arguments);
}

util.inherits(Receipt, Item);

Model.addAttributes(Receipt, {
  image: undefined
});

Receipt.prototype.populateFromAnswers = function(answers) {
  _.each(answers, function(answer) {
    var field = Field.buildFromAnswer(answer);
    this.setField(field.name, field);
  }, this);
};

Item.defineType('receipt', Receipt);
module.exports = Receipt;
