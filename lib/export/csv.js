var _ = require('lodash');
var csv = require('csv-write-stream');
var tabular = require('./tabular');

module.exports = function(report, items, options, services, callback) {
  var data = tabular(report, items, options, services);

  var csvWriter = csv({headers: data.headers});
  callback(null, csvWriter);

  // Write CSV rows
  _.each(data.rows, _.bindKey(csvWriter, 'write'));

  csvWriter.end();
};
