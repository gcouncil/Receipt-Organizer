var _ = require('lodash');
var csv = require('csv-stringify');
var moment = require('moment');

function formatDate(date) {
  return moment(date).format('MM/DD/YYYY');
}

function formatAmount(amount) {
  return (amount).toFixed(2);
}

function formatString(string) {
  // Strip non-printable characters
  return (string + '').replace(/[^\x20-\x7e]/g, '');
}

module.exports = function(report, items, options, services, callback) {
  var skip = 0;
  var stream = csv({ delimiter: '\t' });
  callback(null, stream);

  stream.write(['!TRNS', 'TRNSTYPE', 'DATE', 'ACCNT', 'NAME', 'AMOUNT', 'MEMO']);
  stream.write(['!SPL', 'TRNSTYPE', 'DATE', 'ACCNT', 'NAME', 'AMOUNT', 'MEMO']);
  stream.write(['!ENDTRNS']);

  // Write CSV rows
  _.each(items, function(item) {
    // need to have date
    // need to have name field filled in or vendor for the account name.
    // need to have total
    if ( !item.date || !item.vendor || !item.total ) {
      skip++;
      return;
    }

    stream.write([
      'TRNS',
      'GENERAL JOURNAL',
      formatDate(item.date),
      formatString(options.debitAccount || 'Debit'),
      formatString(item.vendor),
      formatAmount(item.total),
      formatString(item.comments || '')
    ]);

    stream.write([
      'SPL',
      'GENERAL JOURNAL',
      formatDate(item.date),
      formatString(options.creditAccount || 'Credit'),
      formatString(item.vendor),
      formatAmount(-item.total),
      formatString(item.comments || '')
    ]);

    stream.write(['ENDTRNS']);
  });

  if (skip) {
    stream.message = 'Warning: ' + skip + ' items were not exported because of missing data.';
  }

  stream.end();
};
