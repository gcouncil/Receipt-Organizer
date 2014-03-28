var _ = require('lodash');

function Model(attributes) {
  this.reset(attributes);
}

_.extend(Model.prototype, {
  defaults: {
    id: undefined
  },

  parsers: {},

  valid: function() {
    return true;
  },

  toJSON: function() {
    var attributes = _.pick(this, _.keys(this.defaults));
    return _.mapValues(attributes, function(value) {
      return _.has(value, 'toJSON') ? value.toJSON() : value;
    });
  },

  clone: function() {
    return new this.constructor(this.toJSON());
  },

  set: function(attributes) {
    _.each(this.parsers, function(parser, key) {
      attributes[key] = parser(attributes[key]);
    });

    _.extend(this, _.pick(attributes, _.keys(this.defaults)));
  },

  reset: function(attributes) {
    _.extend(this, this.defaults);
    this.set(attributes);
  }
});

module.exports = Model;
