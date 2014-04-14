var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function Tag(attributes) {
  Model.call(this, attributes);
}

util.inherits(Tag, Model);

_.extend(Tag.prototype, {
  defaults: {
    id: undefined,
    name: null,
    path: null,
    // references
    user: null
  }

});

module.exports = Tag;
