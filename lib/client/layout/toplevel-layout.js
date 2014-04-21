var angular = require('angular');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function(
  notify,
  currentUser
) {
  return {
    restrict: 'E',
    template: require('./toplevel-layout.html'),
    link: function($scope) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
      });
    }
  };
});
