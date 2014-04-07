var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function Tag(attributes) {
  Model.call(this, attributes);
}

util.inherits(Tag, Model);

_.extend(Image.prototype, {
  defaults: {
    id: undefined,
    name: undefined,
    // references
    user: null
  }

});

module.exports = Image;
