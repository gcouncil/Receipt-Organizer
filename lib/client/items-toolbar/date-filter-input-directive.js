var angular = require('angular');
var moment = require('moment');

angular.module('epsonreceipts.itemsToolbar').directive('dateFilterInput', function(
  $state
) {
  return {
    restrict: 'E',
    template: require('./date-filter-input-template.html'),
    scope: {},
    controller: function($scope, $stateParams, $element) {
      $scope.showDatePanel = false;

      $scope.$watch(function() {
        return $stateParams.startDate;
      }, function(startDate) {
        if (startDate) {
          $scope.startValue = moment(startDate).format();
        }
      });

      $scope.$watch(function() {
        return $stateParams.endDate;
      }, function(endDate) {
        if (endDate) {
          $scope.endValue = moment(endDate).format();
        }
      });

      $scope.toggleDatePanel = function() {
        $scope.showDatePanel = !$scope.showDatePanel;
      };

      $scope.submit = function() {
        if (!$scope.startValue && !$scope.endValue) {
          $state.go($state.current, { startDate: undefined, endDate: undefined });
          return;
        }

        $state.go($state.current, { startDate: moment($scope.startValue).format(), endDate: moment($scope.endValue).format() });
        $scope.showDatePanel = false;
      };
    }
  };
});
