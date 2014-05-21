var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-editor').controller('ReportEditorController', function(
  $scope,
  deferred,
  $controller,
  reportStorage,
  itemStorage,
  $q
) {

  if (!$scope.items) {
    $scope.items = [];
    var promises = _.each($scope.report.items, function(itemId) {
      return itemStorage.fetch(itemId).then(function(item) {
        $scope.items.push(item);
      });
    });

    $q.all(promises).then(function(results) {
      console.log('Success');
    }, function() {
      console.log('Error');
    });

  }

  function addItemsToReport(items, report) {
    var itemIDs = _.map(items, function(item) {
      return item.id;
    });
    itemIDs = _.uniq(report.items.concat(itemIDs));
    report.items = itemIDs;
  }

  $scope.remove = function(item) {

    _.remove($scope.items, function(item_) {
      return item_.id === item.id;
    });

    _.remove($scope.report.items, function(itemId) {
      return itemId === item.id;
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
