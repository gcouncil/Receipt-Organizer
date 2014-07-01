var Relations = require('./relations');

function Entry(container, file) {
  this.container = container;
  this.file = file || this.container.getUniqueFilename(this.basepath);

  this.rels = new Relations(container, this.file);
  this.doc = document.implementation.createDocument(this.namespace, this.tagName);

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
}

module.exports = Entry;
