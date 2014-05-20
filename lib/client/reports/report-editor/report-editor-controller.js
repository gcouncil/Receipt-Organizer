var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-editor').controller('ReportEditorController', function(
  $scope,
  deferred,
  $controller,
  reportStorage
) {

  function addItemsToReport(items, report) {
    var itemIDs = _.map(items, function(item) {
      return item.id;
    });
    report.items = report.items.concat(itemIDs);
  }

  $scope.remove = function(item) {
    _.remove($scope.items, function(item_) {
      return item_.id === item.id;
    });
  };

  $scope.save = function() {
    addItemsToReport($scope.items, $scope.report);
    reportStorage.persist($scope.report).then(function() {
      deferred.resolve();
    }, function() {
      deferred.reject();
    });
  };

  $scope.cancel = function() {
    deferred.reject();
  };

});
