var angular = require('angular');

angular.module('epsonreceipts.users.signup-form').directive('signupForm', function() {
  return {
    restrict: 'E',
    template: require('./signup-form.html'),
    controller: function($scope, $state, authentication, userStorage, flashManager) {
      $scope.submit = function() {
        userStorage.create($scope.user).then(function(user) {
          authentication.setUser(user);
          flashManager.addMessage('Successfully signed up!', 'success');
          $state.go('receipts.thumbnails');
        });
      };
    }
  };
});
