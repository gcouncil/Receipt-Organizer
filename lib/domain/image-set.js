var _ = require('lodash');
var Model = require('./model');

function Image(attributes) {

}

Image.prototype = _.create(Model.prototype, {
  constructor: Image,

  defaults: {
    id: undefined,
    data: null
  }
});

function ImageSet(attrs) {
  Model.call(this, attrs);
}

ImageSet.prototype = _.create(Model.prototype, {
  constructor: ImageSet,

  defaults: {
    id: undefined,
    images: []
  },

  parsers: {
    images: function(images) {
      return _.map(images, function(data) { return new Image(data); });
    }
  }
});

module.exports = ImageSet;
