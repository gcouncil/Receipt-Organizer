var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('dateFilterInput', function(
  $state
) {
  return {
    restrict: 'E',
    template: require('./date-filter-input-template.html'),
    link: function($scope, $element) {
      $scope.showDatePanel = false;

      $scope.toggleDatePanel = function() {
        $scope.showDatePanel = !$scope.showDatePanel;
      };

      $scope.submit = function() {
        console.log($scope.startValue, $scope.endValue);
        if (!$scope.startValue || !$scope.endValue) {
          return $state.go($state.current, { startDate: undefined, endDate: undefined });
        }
        $state.go($state.current, { startDate: $scope.startValue, endDate: $scope.endValue });
      };
    }
  };
});
