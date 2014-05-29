var angular = require('angular');

angular.module('epsonreceipts.items-toolbar').directive('filterReset', function() {
  return {
    restrict: 'E',
    template: require('./filter-reset-template.html'),
    require: '^itemsCollectionScope',
    link: function($scope, $element, $attributes, itemsCollectionScope) {
      $scope.items = itemsCollectionScope;

      $scope.reset = function() {
        $scope.items.resetFilters();
        $scope.showingFilters = !$scope.showingFilters;
      };
    }
  };
});
