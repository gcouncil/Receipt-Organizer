var _ = require('lodash');
var csv = require('csv-stringify');
var tabular = require('./tabular');

module.exports = function(report, items, options, services, callback) {
  var data = tabular(report, items, options, services);

  var stream = csv({ columns: data.headers, header: true });
  callback(null, stream);

  // Write CSV rows
  _.each(data.rows, _.bindKey(stream, 'write'));

  stream.end();
};
