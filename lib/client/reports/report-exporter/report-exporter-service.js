var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-exporter').factory('reportExporter', function(
  $controller,
  $modal,
  $templateCache,
  $q
) {
  var templateId = _.uniqueId();
  $templateCache.put(templateId, require('./report-exporter-template.html'));

  return function(report) {
    var deferred = $q.defer();

    var dialog = $modal({
      backdrop: 'static',
      keyboard: false,
      template: templateId
    });

    var $scope = dialog.$scope;

    $scope.report = report;

    $controller('ReportExporterController', {
      $scope: $scope,
      deferred: deferred,
      //report: report
    });

    deferred.promise.finally(function() {
      dialog.destroy();
    });

    return deferred.promise;
  };
});

