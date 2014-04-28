var _ = require('lodash');

function Model(attributes) {
  this.reset(attributes);
}

_.extend(Model.prototype, {
  defaults: {
    id: undefined
  },

  valid: function() {
    return true;
  },

  toJSON: function() {
    return _.pick(this, _.keys(this.defaults));
  },

  clone: function() {
    return new this.constructor(this);
  },

  set: function(attributes) {
    var keys = _.keys(this.defaults);
    _.extend(this, _.pick(attributes, keys));
  },

  reset: function(attributes) {
    _.extend(this, this.defaults);
    this.set(attributes);
  }
});

module.exports = Model;
