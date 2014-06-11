var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports-list-view').directive('reportsListView', function(
  reportStorage,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./reports-list-view-template.html'),
    require: ['^itemsCollectionScope', '^reportsCollectionScope'],
    scope: {},
    link: function($scope, $element, $attrs, controllers) {
      var itemsCollectionScope = controllers[0];
      var reportsCollectionScope = controllers[1];

      var pagination = reportsCollectionScope.pagination;
      $scope.selection = reportsCollectionScope.selection;

      pagination.on('change', update);

      $scope.$on('$destroy', function() {
        pagination.off('change', update);
      });

      $scope.totals = $scope.totals || {};

      function totalReports() {
        _.each($scope.reports, function(report) {
          $scope.totals[report.id] = totalReport(report);
        });
      }

      function totalReport(report) {
        return _.reduce(report.items, function(sum, itemId) {
          var item = _.find($scope.items, function(item_) {
            return item_.id === itemId;
          });
          return sum + item.total;
        }, 0);
      }

      function update() {
        $scope.reports = pagination.items;
        $scope.items = itemsCollectionScope.pagination.items;
        totalReports();
      }

      update();
    }
  };
});
