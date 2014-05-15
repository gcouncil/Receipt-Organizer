var _ = require('lodash');
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

Report.prototype.addItem = function(id) {
  if (_.contains(this.items, id)) {
    return false;
  } else {
    this.items.push(id);
    this.items = this.items.sort();
    return true;
  }
};

Report.prototype.removeItem = function(id) {
  _.remove(this.items, function(item) {
    return item === id;
  });
};

module.exports = Report;
