var util = require('util');
var Model = require('./model');

function Field(attributes) {
  Model.apply(this, arguments);
}

util.inherits(Field, Model);

Model.addAttributes(Field, {
  name: null, // e.g. 'total', 'vendor', etc.
  value: null, // e.g. 42.13, 'Quick Left'
  source: null, // either 'user' or 'answer'
  confidence: null, // 0.0 to 1.0
  position: null, // e.g. { x: 32, y: 42, h: 40, w: 200 }
  image: null // UUID
});

Field.buildFromAnswer = function(answer) {
  return new Field({
    name: answer.name,
    value: answer.value,
    source: 'answer',
    confidence: answer.confidence,
    position: answer.position
  });
};

Field.buildFromUser = function(name, value) {
  return new Field({
    name: name,
    value: value,
    source: 'user'
  });
};

// TODO(hsk): Complete list
Field.FIELD_DEFINITIONS = [{
  name: 'date',
  type: 'date'
}, {
  name: 'vendor',
  type: 'string'
}, {
  name: 'paymentType',
  type: 'string'
}, {
  name: 'category',
  type: 'string'
}, {
  name: 'city',
  type: 'string'
}, {
  name: 'state',
  type: 'string'
}, {
  name: 'tax',
  type: 'amount'
}, {
  name: 'additionalTax',
  type: 'amount'
}, {
  name: 'tip',
  type: 'amount'
}, {
  name: 'total',
  type: 'amount'
}, {
  name: 'taxCategory',
  type: 'string'
}, {
  name: 'businessPurpose',
  type: 'string'
}, {
  name: 'reimbursable',
  type: 'boolean'
}, {
  name: 'billable',
  type: 'boolean'
}, {
  name: 'comments',
  type: 'text'
}, {
  name: 'name',
  type: 'string'
}, {
  name: 'user1',
  type: 'string'
}, {
  name: 'user2',
  type: 'string'
}, {
  name: 'user3',
  type: 'string'
}, {
  name: 'user4',
  type: 'string'
}, {
  name: 'user5',
  type: 'string'
}];

Field.prototype.isLowConfidence = function() {
  return this.confidence && this.confidence < 0.7;
};

module.exports = Field;
