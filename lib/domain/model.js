var _ = require('lodash');

function Model(attributes) {
  this.attributes = _.clone(this.defaults, true);
  _.extend(this.attributes, _.clone(attributes, true));
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
  _.extend(this, _.pick(attributes, keys));
};

module.exports = Model;
