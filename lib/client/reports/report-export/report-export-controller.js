var angular = require('angular');
var _ = require('lodash');
var blobStream = require('blob-stream');
var exporters = {
  pdf: require('epson-receipts/export/pdf')
};

angular.module('epsonreceipts.reports.report-export').controller('ReportExportController', function(
  $scope,
  $q,
  deferred,
  itemStorage,
  imageStorage
) {
  $scope.settings = {};

  _.defaults($scope.settings, {
    exportType: 'download',
    exportDetails: 'table',
    exportOptions: [
      { 'text': '.PDF', value: 'pdf' },
      { 'text': '.CSV', value: 'csv' },
      { 'text': '.QIF (Quicken)', value: 'qif' },
      { 'text': '.TXF (Turbo Tax)', value: 'txf' }
    ],
    fileExtension: 'pdf'
  });

  $scope.isActive = function(extension) {
    return $scope.settings.exportDetails === extension;
  };

  $scope.generate = function() {
    $scope.processing = true;
    if ($scope.reportUrl) {
      URL.revokeObjectURL($scope.reportUrl);
      $scope.reportUrl = undefined;
    }

    var services = {
      getImage: function(id, callback) {
        imageStorage.fetch({ id: id })
        .then(function(image) {
          var reader = new FileReader();
          reader.onload = function() {
            var array = new Uint8Array(this.result)
            callback(null, new Buffer(array));
          };
          reader.onerror = function(err) {
            callback(err);
          };
          reader.readAsArrayBuffer(image);
        }, callback);
      }
    };

    var promises = _.map($scope.report.items, function(item) {
      return itemStorage.fetch(item);
    });

    var options = {
      table: /table/.test($scope.settings.exportDetails),
      images: /images/.test($scope.settings.exportDetails),
      items: /itemizations/.test($scope.settings.exportDetails)
    };

    $q.all(promises).then(function(items) {
      exporters[$scope.settings.fileExtension]($scope.report, items, options, services, function(err, stream) {
        if (err) { return console.error(err) }
        stream = stream.pipe(blobStream());

        stream.on('finish', function() {
          url = stream.toBlobURL('application/pdf')

          $scope.processing = false;
          $scope.reportUrl = url;
        });

        stream.on('error', function() {
          $scope.processing = false;
          alert('Export failed');
        });
      });
    });
  };

  $scope.cancel = function() {
    deferred.reject();
  };
});
