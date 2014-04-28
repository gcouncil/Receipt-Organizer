var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('dropdownMenu', function() {
  return {
    restrict: 'E',
    template: require('./dropdown-menu.html'),
    scope: {
      item: '=',
    },
    controller: function($scope) {
      $scope.dropdownActive = false;

      $scope.toggle= function() {
        $scope.dropdownActive = !$scope.dropdownActive;
      };

    }
  };
});
