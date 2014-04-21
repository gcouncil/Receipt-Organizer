var angular = require('angular');

angular.module('epsonreceipts.users.logout').directive('logoutButton', function(
  sessionStorage
) {
  return {
    restrict: 'E',
    template: require('./logout-button.html'),
    link: function($scope) {
      $scope.logout = function() {
        sessionStorage.logout();
      };
    }
  };
});
