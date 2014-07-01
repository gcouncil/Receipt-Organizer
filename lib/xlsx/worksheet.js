var _ = require('lodash');
var util = require('util');
var Entry = require('./entry');
var Drawing = require('./drawing');

util.inherits(Worksheet, Entry);
function Worksheet(container, file) {
  Entry.apply(this, arguments);

  this.rows = 0;
  this.cols = 0;

  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:r', this.rels.namespace);

  this.dimension = this.doc.createElement('dimension');
  this.doc.documentElement.appendChild(this.dimension);

  this.sheetData = this.doc.createElement('sheetData');
  this.doc.documentElement.appendChild(this.sheetData);
}

Worksheet.prototype.basepath = 'xl/worksheets/sheet.xml';
Worksheet.prototype.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';
Worksheet.prototype.namespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
Worksheet.prototype.tagName = 'worksheet';

Worksheet.prototype.setup = function(options) {
  options = options || {};

  if (options.widths) {
    var cols = this.doc.createElement('cols');
    this.doc.documentElement.insertBefore(cols, this.sheetData);

    _.each(options.widths, function(width, i) {
      var col = this.doc.createElement('col');

      col.setAttribute('min', i + 1);
      col.setAttribute('max', i + 1);

      if (width) {
        col.setAttribute('width', width);
        col.setAttribute('customWidth', 'true');
      }

      cols.appendChild(col);
    }, this);
  }
};

Worksheet.prototype.write = function(data, options) {
  var row = this.doc.createElement('row');
  this.cols = Math.max(this.cols, data.length);

  this.dimension.setAttribute('ref', 'A1:' + makeRef(this.cols, this.rows));

  row.setAttribute('r', ++this.rows);
  options = options || {};

  if (options.height) {
    row.setAttribute('customHeight', 'true');
    row.setAttribute('ht', options.height);
  }

  _.each(data, function(text, i) {
    var cell = this.doc.createElement('c');
    cell.setAttribute('r', makeRef(i + 1, this.rows));
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

function makeRef(col, row) {
  var ref = '';
  while(col > 0) {
    ref = String.fromCharCode((col % 26) + 64) + ref;
    col = Math.floor(col / 26);
  }

  return ref + row;
}

module.exports = Worksheet;
