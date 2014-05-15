var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('filterByDateButton', function(
  $state
) {
  return {
    restrict: 'E',
    template: require('./filter-by-date-button-template.html'),
    link: function($scope, $element) {
      $scope.submit = function() {
        if (!$scope.startValue || !$scope.endValue) {
          return $state.go($state.current, { filter: undefined });
        }
        $state.go($state.current, { filter: ['date', $scope.startValue, $scope.endValue] });
      };
    }
  };
});
