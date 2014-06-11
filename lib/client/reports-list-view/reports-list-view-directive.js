var angular = require('angular');

angular.module('epsonreceipts.reports-list-view').directive('reportsListView', function(
  reportStorage
) {
  return {
    restrict: 'E',
    template: require('./reports-list-view-template.html'),
    require: '^reportsCollectionScope',
    scope: {},
    link: function($scope, $element, $attrs, reportsCollectionScope) {
      var pagination = reportsCollectionScope.pagination;
      $scope.selection = reportsCollectionScope.selection;

      function update() {
        $scope.reports = pagination.items;
        console.log('Update reports', $scope);
      }

      pagination.on('change', update);
      $scope.$on('$destroy', function() {
        pagination.off('change', update);
      });

      update();
    }
  };
});
