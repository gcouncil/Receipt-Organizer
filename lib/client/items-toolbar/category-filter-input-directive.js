var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('categoryFilterInput', function(
  $state
) {
  return {
    restrict: 'E',
    template: require('./category-filter-input-template.html'),
    scope: {},
    link: function($scope, $element) {
      $scope.showCategoryPanel = false;

      $scope.toggleCategoryPanel = function() {
        $scope.showCategoryPanel = !$scope.showCategoryPanel;
      };

      $scope.submit = function() {
        if (!$scope.category) {
          $scope.showCategoryPanel = false;
          $state.go($state.current, { category: undefined });
          return;
        }
        $scope.showCategoryPanel = false;
        $state.go($state.current, { category: $scope.category });
      };
    }
  };
});
