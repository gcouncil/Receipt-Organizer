var angular = require('angular');
var _ = require('lodash');
var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.reports.report-editor').controller('ReportEditorController', function(
  $controller,
  $scope,
  $stateParams,
  deferred,
  $controller,
  reportStorage,
  itemStorage,
  $q
) {
  $scope.selection = new Selection();

  $scope.view = $stateParams.view || 'list';

  if (!$scope.items) {
    $scope.items = [];
    itemStorage.promise.then(function() {
      var promises = _.map($scope.report.items, function(itemId) {
        return itemStorage.fetch(itemId).then(function(item) {
          $scope.items.push(item);

          $scope.selection.set({ visibleItems: $scope.items });
        });
      });

      $q.all(promises).then(function() {
        var summary = { since: null, until: null, total: 0, count: 0 };

        _.each($scope.items, function(item) {
          if (!summary.since || item.date < summary.since) {
            summary.since = item.date;
          }

          if (!summary.until || item.date > summary.until) {
            summary.until = item.date;
          }

          if (_.isFinite(item.total)) {
            summary.total += item.total;
          }

          summary.count++;
        });

        $scope.summary = summary;
      });
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
