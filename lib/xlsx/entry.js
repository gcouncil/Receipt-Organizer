var Relations = require('./relations');
var DOMImplementation = require('xmldom').DOMImplementation;
var XMLSerializer = require('xmldom').XMLSerializer;

function Entry(container, file) {
  this.container = container;
  this.file = file || this.container.getUniqueFilename(this.basepath);

  this.rels = new Relations(container, this.file);
  this.doc = (new DOMImplementation()).createDocument(this.namespace, this.tagName);
  var match = this.tagName.match(/^(\w+):\w+$/i);
  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns' + (match ? ':' + match[1] : '' ), this.namespace);

  this.container.addEntry(this);
}

Entry.prototype.serialize = function() {
  var serializer = new XMLSerializer();
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(this.doc);
};

Entry.prototype.finalize = function() {
  var content = this.serialize();

  this.container.addFile(this.file, content, {
    type: this.type,
    rels: this.rels
  });

  this.rels.finalize();
};

module.exports = Entry;
