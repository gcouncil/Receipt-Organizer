var _ = require('lodash');
var util = require('util');
var Model = require('./model');

util.inherits(Tag, Model);

function Tag(attributes) {
  Model.call(this, attributes);
}

_.extend(Tag.prototype, {
  defaults: {
    id: undefined,
    name: null,
    // references
    user: null
  }

});

module.exports = Tag;
