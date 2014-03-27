var _ = require('lodash');

function Model(attrs) {
  this.reset(attrs);
}

_.extend(Model.prototype, {
  valid: function() {
    return true;
  },

  toJSON: function() {
    return _.pick(this, _.keys(this.defaults));
  },

  clone: function() {
    return new this.constructor(this.toJSON());
  },

  reset: function(attrs) {
    _.extend(this, this.defaults, _.pick(attrs, _.keys(this.defaults)));
  }
});

module.exports = Model;
