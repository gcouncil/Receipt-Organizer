var _ = require('lodash');

function Model(attributes) {
  this.attributes = _.clone(this.defaults, true);
  this.set(attributes);
}

Model.addAttributes = function(constructor, defaults) {
  var prototype = constructor.prototype;
  prototype.defaults = _.defaults({}, defaults, prototype.defaults);

  var keys = _.keys(prototype.defaults);
  keys = keys.concat(prototype.keys || []);
  prototype.keys = _.uniq(keys.sort());

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

Model.prototype.whitelist = function() {
  return _.keys(this.defaults);
};

Model.prototype.set = function(attributes) {
  _.each(attributes, function(value, key) {
    if (!_.contains(this.keys, key)) { return; }

    this[key] = _.clone(value, true);
  }, this);
};

module.exports = Model;
