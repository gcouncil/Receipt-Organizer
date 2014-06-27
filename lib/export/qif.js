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

util.inherits(QifStream, stream.Transform);
function QifStream() {
  stream.Transform.apply(this, arguments);

  this._writableState.objectMode = true;
  this._readableState.objectMode = false;

  this.skip = 0;

  this.push('!Type:Cash\n');
}

QifStream.prototype._transform = function(data, encoding, callback) {
  var fields = [];

  if (data.date) { fields.push('D' + formatDate(data.date)); }
  if (data.total) { fields.push('T' + formatAmount(data.total)); }
  if (data.name) { fields.push('M' + formatString(data.name)); }
  if (data.vendor) { fields.push('P' + formatString(data.vendor)); }

  if(!fields.length) {
    console.warn('Empty record');
    this.skip++;
    return callback();
  }

  fields.push('^', '');

  this.push(fields.join('\n'));

  callback();
};

QifStream.prototype._flush = function(callback) {
  if (this.skip) {
    this.message = 'Warning: ' + this.skip + ' items were not exported because of missing data.';
  }

  callback();
};

module.exports = function(report, items, options, services, callback) {
  var stream = _h(items).pipe(new QifStream());
  callback(null, stream);
};
