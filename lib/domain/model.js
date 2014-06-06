var _ = require('lodash');

function Model(attributes) {
  this.attributes = _.clone(this.defaults, true);

  _.each(this.defaults, function(value, key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get: function() { return this.attributes[key]; },
      set: function(value) { this.attributes[key] = value; }
    });
  }, this);

  this.set(attributes);
}

Model.addAttributes = function(constructor, defaults) {
  var prototype = constructor.prototype;
  prototype.defaults = _.defaults({}, defaults, prototype.defaults);

  var keys = _.keys(prototype.defaults);
  keys = keys.concat(prototype.keys || []);
  prototype.keys = _.uniq(keys.sort());
};

Model.load = function(data) {
  return new this(data);
};

Model.prototype.clone = function() {
  return new this.constructor(this.attributes);
};

Model.prototype.toJSON = function() {
  var keys = _.keys(this.defaults);
  var data = _.pick(this.attributes, keys);
  return _.clone(data, true, function(datum) {
    return _.isFunction(datum && datum.toJSON) ? datum.toJSON() : undefined;
  });
};

Model.prototype.whitelist = function() {
  return _.keys(this.defaults);
};

Model.prototype.set = function(attributes) {
  _.each(attributes, function(value, key) {
    if (!_.contains(this.keys, key)) { return; }

    this[key] = _.clone(value, true, function(item) {
      return _.isFunction(item && item.clone) ? item.clone() : undefined;
    });
  }, this);
};

module.exports = Model;
