var _ = require('lodash');
var util = require('util');
var Model = require('./model');

function Folder(attributes) {
  Model.call(this, attributes);
}

util.inherits(Folder, Model);

_.extend(Folder.prototype, {
  defaults: {
    id: undefined,
    name: null,
    // references
    user: null
  }

});

module.exports = Folder;
