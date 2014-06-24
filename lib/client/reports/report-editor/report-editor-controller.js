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
        return itemStorage.fetch(itemId);
      });

      $q.all(promises).then(function(items) {
        $scope.items = _.chain(items)
          .omit(_.isUndefined)
          .sortBy('createdAt')
          .reverse()
          .valueOf();

        recalculate();
      });
    });
  }

  function recalculate() {
    $scope.selection.set({ visibleItems: $scope.items });

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
  }

  $scope.remove = function(items) {
    ids = _.isArray(items) ? _.pluck(items, 'id') : [items.id];

    _.remove($scope.items, function test(item) {
      return _.contains(ids, item.id);
    });
    $scope.report.items = _.difference($scope.report.items, ids);

    recalculate();
  };

  $scope.destroy = function() {
    reportStorage.destroy($scope.report);
    deferred.reject();
  }

  $scope.save = function() {
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
