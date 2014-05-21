var util = require('util');
var Model = require('./model');

function Image(attributes) {
  Model.apply(this, arguments);
}

util.inherits(Image, Model);

Model.addAttributes(Image, {
  id: null,
  user: null
});

module.exports = Image;
