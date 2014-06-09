var angular = require('angular');

angular.module('epsonreceipts.users.user-dropdown-menu').directive('userDropdownMenu', function(
  currentUser,
  $state,
  sessionStorage,
  notify
) {
  return {
    restrict: 'E',
    template: require('./user-dropdown-menu-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
      });

      $scope.logout = function() {
        sessionStorage.logout().then(function() {
          notify.success('Successfully logged out.');
          $state.go('login');
        });
      };

    }
  };
});
