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
  formxtraStatus: 'waiting', // 'waiting', 'done', 'skipped'
  images: []
});

Object.defineProperty(Item.prototype, 'image', {
  get: function() { return this.images && this.images[0]; },
  set: function(value) { this.images = [value]; }
});

Receipt.prototype.populateFromAnswers = function(answers) {
  if (this.formxtraStatus !== 'waiting') {
    return;
  }

  _.each(answers, function(answer) {
    var field = Field.buildFromAnswer(answer);
    this.setField(field.name, field);
  }, this);

  this.formxtraStatus = 'done';
};

Item.defineType('receipt', Receipt);
module.exports = Receipt;
