var _ = require('lodash');

function Model(attributes) {
  _.each(this.defaults, function(value, key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get: function() { return this.attributes[key]; },
      set: function(value) { this.attributes[key] = value; }
    });
  }, this);

  this.reset(attributes);
}

Model.addAttributes = function(constructor, defaults) {
  var prototype = constructor.prototype;

  // Add to list of keys
  prototype.keys = _.chain(prototype.keys || [])
  .concat(_.keys(defaults))
  .sort()
  .uniq(true)
  .valueOf();

  // Add to list of defaults
  prototype.defaults = _.defaults(
    {},
    _.omit(defaults, _.isUndefined),
    prototype.defaults
  );

  // Add getters/setters
  _.each(defaults, function(value, key) {
    Object.defineProperty(prototype, key, {
      enumerable: true,
      get: function() { return this.attributes[key]; },
      set: function(value) { this.attributes[key] = value; }
    });
  });
};

Model.load = function(data) {
  return new this(data);
};

Model.prototype.clone = function() {
  return new this.constructor(this.attributes);
};

Model.prototype.toJSON = function() {
  return _.chain(this.attributes)
  .pick(this.keys)
  .clone(true, function(datum) {
    return _.isFunction(datum && datum.toJSON) ? datum.toJSON() : undefined;
  })
  .valueOf();
};

Model.prototype.reset = function(attributes) {
  this.attributes = _.clone(this.defaults, true);
  this.set(attributes);
};

Model.prototype.set = function(attributes) {
  var self = this;

  _.chain(attributes)
  .pick(this.keys)
  .clone(true, function(value) {
    return _.isFunction(value && value.clone) ? value.clone() : undefined;
  })
  .each(function(value, key) {
    self[key] = value;
  });
};

module.exports = Model;
