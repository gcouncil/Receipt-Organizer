var _ = require('lodash');
var async = require('async');
var Spreadsheet = require('../xlsx/spreadsheet');

module.exports = function(report, items, options, services, callback) {
  var spreadsheet = new Spreadsheet();

  callback(null, spreadsheet.zip);

  var summary = spreadsheet.createSheet('Summary');

  summary.write([
    'Item #',
    'Vendor'
  ]);

  _.each(items, function(item, i) {
    summary.write([
      i + 1,
      item.vendor
    ]);
  });

  var images = spreadsheet.createSheet('Images');

  var row = 0;
  async.eachSeries(items, function(item, callback) {
    if (!item.image) { return callback(); }
    row++;

    services.getImage(item.image, function(err, image) {
      if (err) { return callback(err); }

      // TODO: Handle image type, don't assume jpg
      images.insertImage(image, { from: { row: row, col: 1 }, to: { row: row + 1, col: 2}, extension: 'jpg' });

      callback();
    });

  }, function(err) {
    if (err) { console.error(err); }
    spreadsheet.finalize();
  });
};
