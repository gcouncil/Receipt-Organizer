var util = require('util');
var Entry = require('./entry');
var Worksheet = require('./worksheet');
var Styles = require('./styles');

util.inherits(Workbook, Entry);
function Workbook(container, file) {
  Entry.apply(this, arguments);
  this.counter = 0;

  this.doc.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:r', this.rels.namespace);

  this.styles = new Styles(this.container, 'xl/styles.xml');
  this.rels.make('http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles', 'xl/styles.xml', this.file);

  this.sheets = this.doc.createElement('sheets');
  this.doc.documentElement.appendChild(this.sheets);
}

Workbook.REGEXP = /^([A-Z]+)(\d+)$/;

Workbook.prototype.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml';
Workbook.prototype.namespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
Workbook.prototype.tagName = 'workbook';

Workbook.prototype.createSheet = function(name) {
  this.counter++;

  var worksheet = new Worksheet(this.container);
  var rel = this.rels.make('http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet', worksheet.file, this.file);

  var sheet = this.doc.createElement('sheet');

  sheet.setAttribute('name', name);
  sheet.setAttribute('sheetId', this.counter);
  sheet.setAttributeNS(this.rels.namespace, 'r:id', rel);

  this.sheets.appendChild(sheet);

  return worksheet;
};

module.exports = Workbook;
