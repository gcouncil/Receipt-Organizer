var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function Report(attributes) {
  Model.apply(this, arguments);
}

Report.name = 'Report';

util.inherits(Report, Model);

Model.addAttributes(Report, {
  id: undefined,
  name: undefined,
  items: [],
  reimbursed: false,
  comments: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  user: undefined
});

Report.load = function(data) {
  return new Report(data);
};

Report.prototype.addItem = function(id) {
  if (_.contains(this.items, id)) {
    return false;
  } else {
    this.items.push(id);
    this.items = _.uniq(this.items.sort(), true);
    return true;
  }
};

Report.prototype.removeItem = function(id) {
  _.remove(this.items, function(item) {
    return item === id;
  });
};

module.exports = Report;
