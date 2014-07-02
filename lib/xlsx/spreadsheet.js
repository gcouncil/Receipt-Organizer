var util = require('util');
var Container = require('./container');
var Workbook = require('./workbook');

util.inherits(Spreadsheet, Container);
function Spreadsheet() {
  Container.call(this);

  this.workbook = new Workbook(this, 'xl/workbook.xml');
  this.rels.make('http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument', 'xl/workbook.xml');
}

Spreadsheet.prototype.createSheet = function(name, options) {
  return this.workbook.createSheet(name, options);
};

module.exports = Spreadsheet;
