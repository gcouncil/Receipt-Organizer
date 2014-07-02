var DOMImplementation = require('xmldom').DOMImplementation;
var XMLSerializer = require('xmldom').XMLSerializer;

function ContentTypes(container) {
  this.container = container;
  this.doc = (new DOMImplementation()).createDocument(this.namespace, 'Types');
  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', this.namespace);
}

ContentTypes.prototype.namespace = 'http://schemas.openxmlformats.org/package/2006/content-types';

ContentTypes.prototype.default = function(extension, type) {
  var defaults = this.doc.createElement('Default');

  defaults.setAttribute('Extension', extension);
  defaults.setAttribute('ContentType', type);

  this.doc.documentElement.appendChild(defaults);
};

ContentTypes.prototype.override = function(name, type) {
  var override = this.doc.createElement('Override');

  override.setAttribute('PartName', '/' + name);
  override.setAttribute('ContentType', type);

  this.doc.documentElement.appendChild(override);
};

ContentTypes.prototype.serialize = function() {
  var serializer = new XMLSerializer();
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(this.doc);
};

ContentTypes.prototype.finalize = function() {
  var content = this.serialize();

  this.container.addFile('[Content_Types].xml', content);
};

module.exports = ContentTypes;
