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
    uuid: undefined,
    data: null,
    url: null
  },

  getImgSrc: function() {
    if (this.data) {
      return 'data:image/jpeg;base64,' + this.data;
    } else {
      return this.url;
    }
  }
});

module.exports = Image;
