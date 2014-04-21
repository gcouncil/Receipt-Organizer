var angular = require('angular');

angular.module('epsonreceipts.users.logout').directive('logoutButton', function(
  $state,
  sessionStorage,
  notify
) {
  return {
    restrict: 'E',
    template: require('./logout-button.html'),
    link: function($scope) {
      $scope.logout = function() {
        sessionStorage.logout().then(function() {
          notify.success('Successfully logged out.');
          $state.go('login');
        });
      };
    }
  };
});
