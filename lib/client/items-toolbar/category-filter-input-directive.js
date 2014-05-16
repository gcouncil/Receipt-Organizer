var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('categoryFilterInput', function(
  $state
) {
  return {
    restrict: 'E',
    template: require('./category-filter-input-template.html'),
    link: function($scope, $element) {
      $scope.showPanel="false"

      $scope.toggleCategoryPanel = function() {
        $scope.showCategoryPanel = !$scope.showCategoryPanel;
      };

      $scope.submit = function() {
        if (!$scope.category) {
          return $state.go($state.current, { category: undefined });
        }
        $state.go($state.current, { category: $scope.category });
      };
    }
  };
});
