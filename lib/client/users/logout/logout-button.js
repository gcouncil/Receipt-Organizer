var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.users.logout').directive('logoutButton', function() {
  return {
    restrict: 'E',
    template: require('./logout-button.html'),
    controller: function($scope, $state, authentication, flashManager) {
      _.extend($scope, {
        logout: function() {
          authentication.clearUser();
          flashManager.addMessage('Successfully logged out.', 'success');
          $state.go('login');
        }
      });
    }
  };
});
