var angular = require('angular');

angular.module('epsonreceipts.users.login-form').directive('loginForm', function(
  $state,
  $q,
  sessionStorage,
  notify
) {
  return {
    restrict: 'E',
    template: require('./login-form.html'),
    link: function($scope) {
      $scope.submit = function() {
        sessionStorage.login(
          $scope.user.email,
          $scope.user.password
        )
        .success(function(data, status, headers, config) {
          notify.success('Successfully logged in.');
          $state.go('receipts.thumbnails');
        })
        .error(function(data, status, headers, config) {
          var message = status === 401 ? 'Incorrect email or password' : 'Unknown error';
          notify.error(data.message || message);
        });
      };
    }
  };
});
