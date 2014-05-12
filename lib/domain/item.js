var _ = require('lodash');
var util = require('util');
var Model = require('./model');
var Field = require('./field');

function Item(attributes) {
  Model.apply(this, arguments);
}

util.inherits(Item, Model);

Model.addAttributes(Item, {
  id: null,
  fields: [],
  folders: [],
  reviewed: false,

  createdAt: null,
  updatedAt: null,
  user: null
});

_.each(Field.FIELD_DEFINITIONS, function(definition) {
  Object.defineProperty(Item.prototype, definition.name, {
    enumerable: true,
    get: function() { return this.getFieldValue(definition.name); },
    set: function(value) { return this.setFieldValue(definition.name, value); }
  });
});

Item.prototype.getField = function(name) {
  return _.find(this.fields, { name: name });
};

Item.prototype.getFieldValue = function(name) {
  var field = this.getField(name);
  return field && field.value;
};

Item.prototype.setFieldValue = function(name, value) {
  var field = Field.buildFromUser(name, value);

  var i = _.sortedIndex(this.fields, { name: name });

  var match = this.fields[i];
  var exists = match && match.name === name ? 1 : 0;
  this.fields.splice(i, exists,field);
};

Item.prototype.addFolder = function(id) {
  if (_.contains(this.folders, id)) {
    return false;
  } else {
    this.folders.push(id);
    this.folders = this.folders.sort();
    return true;
  }
};

Item.prototype.removeFolder = function(id) {
  _.remove(this.folders, function(folder) {
    return folder === id;
  });
};

module.exports = Item;
