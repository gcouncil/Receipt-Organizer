var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-editor').factory('reportEditor', function(
  $controller,
  $modal,
  $templateCache,
  $q
) {
  var templateId = _.uniqueId();
  $templateCache.put(templateId, require('./report-editor-template.html'));

  return function(report, items) {
    var deferred = $q.defer();

    var dialog = $modal({
      backdrop: 'static',
      keyboard: false,
      template: templateId
    });

    var $scope = dialog.$scope;

    $scope.report = report.clone();

    if (items) {
      $scope.report.items = _.pluck(items, 'id');
    }

    $controller('ReportEditorController', {
      $scope: $scope,
      deferred: deferred,
      report: report
    });

    deferred.promise.finally(function() {
      dialog.destroy();
    });

    return deferred.promise;
  };
});

