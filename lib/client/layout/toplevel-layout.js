var angular = require('angular');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function(
  notify,
  authentication
) {
  return {
    restrict: 'E',
    template: require('./toplevel-layout.html'),
    link: function($scope) {
      $scope.$watch(function() {
        return authentication.user;
      }, function(user) {
        $scope.currentUser = user;
      });
    }
  };
});
