var _ = require('lodash');
var util = require('util');
var Entry = require('./entry');
var Drawing = require('./drawing');

util.inherits(Worksheet, Entry);
function Worksheet(container, file) {
  Entry.apply(this, arguments);

  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:r', this.rels.namespace);

  this.sheetData = this.doc.createElement('sheetData');
  this.doc.documentElement.appendChild(this.sheetData);
}

Worksheet.prototype.basepath = 'xl/worksheets/sheet.xml';
Worksheet.prototype.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';
Worksheet.prototype.namespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
Worksheet.prototype.tagName = 'worksheet';

Worksheet.prototype.write = function(data) {
  var row = this.doc.createElement('row');

  _.each(data, function(text) {
    var cell = this.doc.createElement('c');
    cell.setAttribute('t', 'str');
    row.appendChild(cell);

    var value = this.doc.createElement('v');
    cell.appendChild(value);

    value.appendChild(this.doc.createTextNode(text));
  }, this);

  this.sheetData.appendChild(row);
};

Worksheet.prototype.insertImage = function(image, options) {
  var drawing = this.getDrawing();

  drawing.insertImage(image, options);
};

Worksheet.prototype.getDrawing = function() {
  if (this.drawing) { return this.drawing; }

  this.drawing = new Drawing(this.container);

  var rel = this.rels.make('http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing', this.drawing.file, this.file);

  var element = this.doc.createElement('drawing');
  element.setAttributeNS(this.rels.namespace, 'r:id', rel);
  this.doc.documentElement.appendChild(element);

  return this.drawing;
}

module.exports = Worksheet;
