var util = require('util');
var Model = require('./model');

function Folder(attributes) {
  Model.apply(this, arguments);
}

Folder.name = 'Folder';

util.inherits(Folder, Model);

Model.addAttributes(Folder, {
  id: undefined,
  name: undefined,
  user:undefined
});

module.exports = Folder;
