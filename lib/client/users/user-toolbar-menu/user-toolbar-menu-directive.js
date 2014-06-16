var angular = require('angular');

angular.module('epsonreceipts.users.user-toolbar-menu').directive('userToolbarMenu', function(
  currentUser,
  $state,
  sessionStorage,
  notify,
  $dropdown
) {
  return {
    restrict: 'E',
    replace: true,
    template: require('./user-toolbar-menu-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
      });

      $scope.actions = [{
        text: 'Account Settings',
        click: 'accountSettings()'
      }];

      $scope.accountSettings = function() {
        $state.go('settings.account');
      };

      $scope.logout = function() {
        sessionStorage.logout().then(function() {
          notify.success('Successfully logged out.');
          $state.go('login');
        });
      };
    }
  };
});
