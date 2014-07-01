var _ = require('lodash');
var util = require('util');
var Entry = require('./entry');

util.inherits(Drawing, Entry);
function Drawing(container, file) {
  Entry.apply(this, arguments);

  this.counter = 0;

  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:a', DRAWING_NAMESPACE);
  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:r', this.rels.namespace);
}

var DRAWING_NAMESPACE = 'http://schemas.openxmlformats.org/drawingml/2006/main';

Drawing.prototype.basepath = 'xl/drawings/drawing.xml';
Drawing.prototype.type = 'application/vnd.openxmlformats-officedocument.drawing+xml';
Drawing.prototype.namespace = 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing';
Drawing.prototype.tagName = 'xdr:wsDr';

Drawing.prototype.insertImage = function(image, options) {
  var anchor = this.doc.createElementNS(this.namespace, 'xdr:twoCellAnchor');
  anchor.setAttribute('editAs', 'oneCell');
  this.doc.documentElement.appendChild(anchor);

  var row, col, rowOff, colOff;

  var from = this.doc.createElementNS(this.namespace, 'xdr:from');
  anchor.appendChild(from);

  col = this.doc.createElementNS(this.namespace, 'xdr:col');
  col.appendChild(this.doc.createTextNode(options.from.col || 0));
  from.appendChild(col);

  colOff = this.doc.createElementNS(this.namespace, 'xdr:colOff');
  colOff.appendChild(this.doc.createTextNode(options.from.colOff || 0));
  from.appendChild(colOff);

  row = this.doc.createElementNS(this.namespace, 'xdr:row');
  row.appendChild(this.doc.createTextNode(options.from.row || 0));
  from.appendChild(row);

  rowOff = this.doc.createElementNS(this.namespace, 'xdr:rowOff');
  rowOff.appendChild(this.doc.createTextNode(options.from.rowOff || 0));
  from.appendChild(rowOff);

  var to = this.doc.createElementNS(this.namespace, 'xdr:to');
  anchor.appendChild(to);

  col = this.doc.createElementNS(this.namespace, 'xdr:col');
  col.appendChild(this.doc.createTextNode(options.to.col || 0));
  to.appendChild(col);

  colOff = this.doc.createElementNS(this.namespace, 'xdr:colOff');
  colOff.appendChild(this.doc.createTextNode(options.from.colOff || 0));
  to.appendChild(colOff);

  row = this.doc.createElementNS(this.namespace, 'xdr:row');
  row.appendChild(this.doc.createTextNode(options.to.row || 0));
  to.appendChild(row);

  rowOff = this.doc.createElementNS(this.namespace, 'xdr:rowOff');
  rowOff.appendChild(this.doc.createTextNode(options.from.rowOff || 0));
  to.appendChild(rowOff);

  var pic = this.doc.createElementNS(this.namespace, 'xdr:pic');
  anchor.appendChild(pic);

  var nvPicPr = this.doc.createElementNS(this.namespace, 'xdr:nvPicPr');
  pic.appendChild(nvPicPr);

  var cNvPr = this.doc.createElementNS(this.namespace, 'xdr:cNvPr');
  cNvPr.setAttribute('id', ++this.counter);
  cNvPr.setAttribute('name', 'Picture ' + this.counter);
  nvPicPr.appendChild(cNvPr);

  nvPicPr.appendChild(this.doc.createElementNS(this.namespace, 'xdr:cNvPicPr'));

  var blipFill = this.doc.createElementNS(this.namespace, 'xdr:blipFill');
  pic.appendChild(blipFill);

  var file = this.container.getUniqueFilename('xl/media/image.' + options.extension);
  this.container.addFile(file, image);

  var rel = this.rels.make('http://schemas.openxmlformats.org/officeDocument/2006/relationships/image', file, this.file);

  var blip = this.doc.createElementNS(DRAWING_NAMESPACE, 'a:blip');
  blip.setAttributeNS(this.rels.namespace, 'r:embed', rel);
  blipFill.appendChild(blip);

  var spPr = this.doc.createElementNS(this.namespace, 'xdr:spPr');
  pic.appendChild(spPr);

  var prstGeom = this.doc.createElementNS(DRAWING_NAMESPACE, 'a:prstGeom');
  prstGeom.setAttribute('prst', 'rect');
  spPr.appendChild(prstGeom);

  prstGeom.appendChild(this.doc.createElementNS(DRAWING_NAMESPACE, 'a:avLst'));

  anchor.appendChild(this.doc.createElementNS(this.namespace, 'xdr:clientData'));
};

module.exports = Drawing;
