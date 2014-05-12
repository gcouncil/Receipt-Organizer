var util = require('util');
var Model = require('./model');

function Folder(attributes) {
  Model.apply(this, arguments);
}

util.inherits(Folder, Model);

Model.addAttributes(Folder, {
  id: null,
  name: null,

  user: null
});

module.exports = Folder;
