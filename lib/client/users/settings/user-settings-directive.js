var angular = require('angular');

angular.module('epsonreceipts.users.settings').directive('userSettings', function(
  $state
){
  return {
    restrict: 'E',
    template: require('./user-settings-template.html'),
    controller: function($scope){
      $scope.$watch(function() {
        return $state.$current.name;
      }, function(page) {
        $scope.currentPage = page.split('.')[1];
      });

      $scope.isCurrentPage = function(name) {
        return $scope.currentPage === name;
      };
    }
  };
});
