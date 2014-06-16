var angular = require('angular');

angular.module('epsonreceipts.reports.report-exporter').controller('ReportExporterController', function(
  $scope,
  deferred
) {
  $scope.save = function() {
    deferred.resolve();
  };

  $scope.cancel = function() {
    deferred.reject();
  };
});
