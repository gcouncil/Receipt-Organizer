var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-export').controller('ReportExportController', function(
  $scope,
  deferred
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
    deferred.resolve();
  };

  $scope.cancel = function() {
    deferred.reject();
  };
});
