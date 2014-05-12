var _ = require('lodash');

function Model(attributes) {
  this.attributes = _.clone(this.defaults);
  _.extend(this.attributes, attributes);
}

Model.addAttributes = function(constructor, defaults) {
  var prototype = constructor.prototype;
  prototype.defaults = _.defaults(defaults, prototype.defaults);

  _.each(defaults, function(value, key) {
    Object.defineProperty(prototype, key, {
      enumerable: true,
      get: function() { return this.attributes[key]; },
      set: function(value) { this.attributes[key] = value; }
    });
  });
};

Model.prototype.clone = function() {
  return new this.constructor(this.attributes);
};

Model.prototype.toJSON = function() {
  return _.pick(this.attributes, _.keys(this.defaults));
};

Model.prototype.set = function(attributes) {
  var keys = _.keys(this.defaults);
  keys = _.remove(keys, function(key) {
    return key === 'fields';
  });
  console.log(keys);
  _.extend(this, _.pick(attributes, keys));
};

module.exports = Model;
