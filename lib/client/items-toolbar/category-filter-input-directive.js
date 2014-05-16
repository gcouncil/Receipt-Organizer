var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('categoryFilterInput', function(
  $state
) {
  return {
    restrict: 'E',
    template: require('./category-filter-input-template.html'),
    link: function($scope, $element) {

      $scope.submit = function() {
        if (!$scope.category) {
          return $state.go($state.current, { filter: undefined });
        }
        $state.go($state.current, { filter: ['category', $scope.category] });
      };
    }
  };
});
