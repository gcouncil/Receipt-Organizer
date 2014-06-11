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
    link: function($scope, $element, $attrs, reportsCollectionScope) {
      var pagination = reportsCollectionScope.pagination;
      $scope.selection = reportsCollectionScope.selection;

      function update() {
        $scope.reports = pagination.items;
        $scope.items = itemsCollectionScope.pagination.items;
        console.log('Update reports', $scope);
      }

      pagination.on('change', update);
      $scope.$on('$destroy', function() {
        pagination.off('change', update);
      });

      $scope.totalReport = function(report) {
        return _.reduce(report.items, function(sum, itemId) {
          var item = _.find($scope.items, function(item_) {
            return item_.id === itemId;
          });
          return sum + item.total;
        });
      };

      update();
    }
  };
});
