var _ = require('lodash');
var csv = require('csv-write-stream');
var tabular = require('./tabular');

module.exports = function(report, items, options, services, callback) {
  var data = tabular(report, items, options, services);

  // need to have date
  // need to have name field filled in or vendor for the account name.
  // need to have total
  var transHeader = ['!TRNS', 'TRNSID',  'TRNSTYPE',  'DATE',  'ACCNT','NAME',  'CLASS', 'AMOUNT',  'DOCNUM',  'MEMO',  'NAMEISTAXABLE', 'ADDR1', 'ADDR2', 'ADDR3', 'ADDR4', 'ADDR5', 'PAYMETH', 'SHIPVIA', 'SHIPDATE',  'OTHER1'];
  var splHeader = ['!SPL', 'SPLID', 'TRNSTYPE',  'DATE',  'ACCNT', 'NAME',  'CLASS', 'AMOUNT',  'DOCNUM',  'MEMO',  'PRICE', 'INVITEM', 'PAYMETH', 'TAXABLE', 'VALADJ',  'REIMBEXP',  'PAYITEM', 'YEARTODATE',  'WAGEBASE',  'EXTRA'];
  var endTransHeader = '!ENDTRNS';

  var csvWriter = csv({headers: data.headers});
  callback(null, csvWriter);

  // Write CSV rows
  _.each(data.rows, _.bindKey(csvWriter, 'write'));

  csvWriter.end();
};
