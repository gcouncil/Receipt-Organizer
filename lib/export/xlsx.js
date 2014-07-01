var _ = require('lodash');
var $ = require('jquery');
var async = require('async');
var Spreadsheet = require('../xlsx/spreadsheet');
var tabular = require('./tabular');

module.exports = function(report, items, options, services, callback) {
  var data = tabular(report, items, options, services);

  var spreadsheet = new Spreadsheet();

  callback(null, spreadsheet.zip);

  var summary = spreadsheet.createSheet('Summary');


  summary.write(data.headers);

  _.each(data.rows, function(row, i) {
    summary.write(row);
  });

  var colWidth = 24;
  var images = spreadsheet.createSheet('Images', { widths: [undefined, colWidth] });
  images.write(['Item #', 'Image']);


  var i = 0, row = 0;
  async.eachSeries(items, function(item, callback) {
    i++;
    if (!item.image) { return callback(); }
    row++;

    services.getImage(item.image, function(err, image, blob) {
      if (err) { return callback(err); }


      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.src = url;

      $(img).bind('load', function() {
        var width = img.width;
        var height = img.height;

        URL.revokeObjectURL(url);

        images.write([i], { height: (colWidth * 7)/ width * height });

        // TODO: Handle image type, don't assume jpg
        images.insertImage(image, { from: { row: row, col: 1 }, to: { row: row + 1, col: 2}, extension: 'jpg' });

        callback();
      });
    });

  }, function(err) {
    if (err) { console.error(err); }
    spreadsheet.finalize();
  });
};
