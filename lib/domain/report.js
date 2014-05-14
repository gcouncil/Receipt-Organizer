var util = require('util');
var Model = require('./model');

function Report(attributes) {
  Model.apply(this, arguments);
}

util.inherits(Report, Model);

Model.addAttributes(Report, {
  id: undefined,
  name: undefined,
  items: [],
  createdAt: undefined,
  updatedAt: undefined,
  user: undefined
});

module.exports = Report;
