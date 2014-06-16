var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-exporter').controller('ReportExporterController', function(
  $scope,
  deferred
) {
  $scope.settings = {};

  _.defaults($scope.settings, {
    exportType: 'download',
    exportDetails: 'table',
    exportOptions: [
      { 'text': '.PDF' },
      { 'text': '.CSV' },
      { 'text': '.QIF' }
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
