var angular = require('angular');

angular.module('epsonreceipts.users.login-form').directive('loginForm', function() {
  return {
    restrict: 'E',
    template: require('./login-form.html'),
    controller: function($scope, $state, $http, authentication, flashManager) {
      $scope.submit = function() {
        $http.post('/api/login', { username: $scope.user.email, password: $scope.user.password })
        .success(function(data, status, headers, config) {
          authentication.setUser(data);
          flashManager.addMessage('Successfully logged in.', 'success');
          $state.go('receipts.thumbnails');
        })
        .error(function(data, status, headers, config) {
          if (status === 401) {
            flashManager.addMessage('Incorrect email or password.', 'danger');
          } else {
            flashManager.addMessage('Sorry, an unknown error prevented you from logging in.', 'danger');
          }
        });
      };
    }
  };
});
