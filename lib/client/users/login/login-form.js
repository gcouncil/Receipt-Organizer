var angular = require('angular');

angular.module('epsonreceipts.users.login-form').directive('loginForm', function() {
  return {
    restrict: 'E',
    template: require('./login-form.html'),
    controller: function($scope, $state, flashManager) {
      $scope.submit = function() {
        // Authenticate the user
        flashManager.addMessage('Successfully logged in.', 'success');
        $state.go('receipts.thumbnails');
      };
    }
  };
});
