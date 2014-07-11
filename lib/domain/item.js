var _ = require('lodash');
var morph = require('morph');
var util = require('util');
var Model = require('./model');
var Field = require('./field');

function Item(attributes) {
  Model.apply(this, arguments);

  // Hack to support selectize.js in receipt editor
  Object.defineProperty(this, 'id', {
    get: function() { return this.attributes.id; },
    set: function(value) { this.attributes.id = value; }
  });

  this._updateItem();
}

util.inherits(Item, Model);

Model.addAttributes(Item, {
  id: undefined,
  fields: [],
  folders: [],
  reviewed: false,

  createdAt: undefined,
  updatedAt: undefined,
  user: undefined
});

_.each(Field.FIELD_DEFINITIONS, function(definition) {
  Item.prototype.keys.push(definition.name);

  Object.defineProperty(Item.prototype, definition.name, {
    enumerable: true,
    get: function() { return this.getFieldValue(definition.name); },
    set: function(value) { return this.setFieldValue(definition.name, value); }
  });
});

Object.defineProperty(Item.prototype, 'description', {
  enumerable: true,
  get: function() { return this.name || morph.toTitle(this.type); }
});

Item.TYPES = {};

Item.defineType = function(type, constructor) {
  Item.TYPES[type] = constructor;

  // TODO(hsk): It would be nice if the type attribute was somehow 'read-only' but the complexity may not be worth it
  Model.addAttributes(constructor, { type: type });
};

Item.load = function(data) {
  var Constructor = Item.TYPES[data.type];

  if (!Constructor) {
    throw new Error('Unknown item type ' + data.type);
  }

  if (data.fields) {
    data.fields = _.map(data.fields, function(field) {
      field = new Field(field);
      return field;
    });
  }

  return new Constructor(data);
};

Item.prototype.getField = function(name) {
  return _.find(this.fields, { name: name });
};

Item.prototype.getFieldValue = function(name) {
  var field = this.getField(name);
  return field && field.value;
};

Item.prototype.setFieldValue = function(name, value) {
  var field = Field.buildFromUser(name, value);
  this.setField(name, field);
};

Item.prototype.setField = function(name, field) {
  var i = _.findIndex(this.fields, { name: name });

  if (i >= 0) {
    this.fields[i] = field;
  } else {
    this.fields.push(field);
  }

  this._updateItem();
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

var empty = []; // Prevent angular digest loops
Item.prototype.getAnswers = function(page) {
  if (page === 0) {
    return this.answers;
  } else {
    return empty;
  }
};

Item.prototype._updateItem = function() {
  this.answers = _.filter(this.fields, { source: 'answer' });
};

Item.prototype.fieldIsLowConfidence = function(name) {
  var field = this.getField(name);
  return field && field.isLowConfidence();
};

module.exports = Item;
