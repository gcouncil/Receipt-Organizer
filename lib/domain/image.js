var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function Image(attributes) {
  Model.call(this, attributes);
}

util.inherits(Image, Model);

_.extend(Image.prototype, {
  defaults: {
    id: undefined,
    // references
    user: null
  }
});

module.exports = Image;
