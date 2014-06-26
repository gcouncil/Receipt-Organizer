var angular = require('angular');
var _ = require('lodash');
var blobStream = require('blob-stream');
var exporters = {
  pdf: require('epson-receipts/export/pdf'),
  csv: require('epson-receipts/export/csv')
};

angular.module('epsonreceipts.reports.report-export').controller('ReportExportController', function(
  $scope,
  $q,
  deferred,
  itemStorage
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

  $scope.save = function() {
    var promises = _.map($scope.report.items, function(item) {
      return itemStorage.fetch(item);
    });

    $q.all(promises).then(function(items) {
      exporters[$scope.settings.fileExtension]($scope.report, items, $scope.settings, function(err, stream) {
        stream = stream.pipe(blobStream());

        stream.on('finish', function() {
          url = stream.toBlobURL('application/pdf')

          window.open(url);

          deferred.resolve();
        });

        stream.on('error', function() {
          alert('Export failed');
        });
      });
    });
  };

  $scope.cancel = function() {
    deferred.reject();
  };
});
