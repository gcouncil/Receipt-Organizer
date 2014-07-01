var path = require('path');
var DOMImplementation = require('xmldom').DOMImplementation;
var XMLSerializer = require('xmldom').XMLSerializer;

function Relations(container, file) {
  this.container = container;
  this.file = Relations.path(file);

  this.counter = 0;
  this.doc = (new DOMImplementation).createDocument('http://schemas.openxmlformats.org/package/2006/relationships', 'Relationships');
  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://schemas.openxmlformats.org/package/2006/relationships');
}

Relations.path = function(name) {
  return path.join(path.dirname(name), '_rels', path.basename(name) + '.rels');
};

Relations.prototype.namespace = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

Relations.prototype.make = function(type, target, base) {
  this.counter++;
  var id = 'rId' + this.counter;

  var relation = this.doc.createElement('Relationship');
  relation.setAttribute('Id', id);
  relation.setAttribute('Type', type);
  relation.setAttribute('Target', path.relative(path.dirname(base), target));

  this.doc.documentElement.appendChild(relation);

  return id;
};

Relations.prototype.serialize = function() {
  var serializer = new XMLSerializer();
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(this.doc);
};

Relations.prototype.finalize = function() {
  if (!this.counter) { return; }

  var content = this.serialize();

  this.container.addFile(this.file, content);
};

module.exports = Relations;
