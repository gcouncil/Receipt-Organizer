var util = require('util');
var Entry = require('./entry');

util.inherits(Styles, Entry);
function Styles(container, file) {
  Entry.apply(this, arguments);

  this.fonts = this.doc.createElement('fonts');
  this.fonts.setAttribute('count', 1);
  this.fonts.appendChild(this.doc.createElement('font'));

  this.doc.documentElement.appendChild(this.fonts);

  this.fills = this.doc.createElement('fills');
  this.fills.setAttribute('count', 1);
  this.fills.appendChild(this.doc.createElement('fill'));

  this.doc.documentElement.appendChild(this.fills);

  this.borders = this.doc.createElement('borders');
  this.borders.setAttribute('count', 1);
  this.borders.appendChild(this.doc.createElement('border'));

  this.doc.documentElement.appendChild(this.borders);

  this.cellStyleXfs = this.doc.createElement('cellStyleXfs');
  this.cellStyleXfs.setAttribute('count', 1);
  this.cellStyleXfs.appendChild(this.doc.createElement('xf'));

  this.doc.documentElement.appendChild(this.cellStyleXfs);

  this.cellXfs = this.doc.createElement('cellXfs');
  this.cellXfs.setAttribute('count', 1);
  this.cellXfs.appendChild(this.doc.createElement('xf'));

  this.doc.documentElement.appendChild(this.cellXfs);

  this.cellStyles = this.doc.createElement('cellStyles');
  this.cellStyles.setAttribute('count', 1);

  var cellStyle = this.doc.createElement('cellStyle');
  cellStyle.setAttribute('xfId', 0);
  this.cellStyles.appendChild(cellStyle);

  this.doc.documentElement.appendChild(this.cellStyles);
}

Styles.prototype.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml';
Styles.prototype.namespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
Styles.prototype.tagName = 'styleSheet';

module.exports = Styles;

