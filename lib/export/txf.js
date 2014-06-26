var _h = require('highland');
var stream = require('stream');
var moment = require('moment');
var util = require('util');

function formatDate(date) {
  return moment(date).format('MM/DD/YYYY');
}

function formatAmount(amount) {
  return (-amount).toFixed(2);
}

function formatString(string) {
  // Strip non-printable characters
  return (string + '').replace(/[^\x20-\x7e]/g, '');
}

util.inherits(TxfStream, stream.Transform);
function TxfStream() {
  stream.Transform.apply(this, arguments);

  this._writableState.objectMode = true;
  this._readableState.objectMode = false;

  this.push('V042\n');
  this.push('AEPSON Receipts\n');
  this.push('D' +  formatDate() + '\n');
  this.push('^\n');
}

TxfStream.prototype._transform = function(data, encoding, callback) {
  var fields = [];

  if (!data.taxCategory) {
    console.warn('Item skiped becasue no tax category was present');
    return callback();
  }

  if (!data.total) {
    console.warn('Item skiped becasue no total was present');
    return callback();
  }


  var description = [];

  if (data.date) { description.push(formatDate(data.date)); }
  if (data.vendor) { description.push(formatString(data.vendor)); }
  if (data.name) { description.push(formatString(data.name)); }
  description.push('(EPSON Receipts)');

  fields.push('TD');
  fields.push('N' + formatString(data.taxCategory));
  fields.push('C1');
  fields.push('L1');
  fields.push('$' + formatAmount(data.total));


  fields.push('X ' + formatString(description.join(' : ')));

  fields.push('^', '');

  this.push(fields.join('\n'));

  callback();
};

TxfStream.prototype._flush = function(callback) {
  callback();
};

module.exports = function(report, items, options, services, callback) {
  var stream = _h(items).pipe(new TxfStream());
  callback(null, stream);
};
