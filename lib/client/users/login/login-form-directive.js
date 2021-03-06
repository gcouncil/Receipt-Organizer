var angular = require('angular');

angular.module('epsonreceipts.users.login').directive('loginForm', function(
  $state,
  $q,
  sessionStorage,
  notify
) {
  return {
    restrict: 'E',
    template: require('./login-form-template.html'),
    link: function($scope) {
      $scope.submit = function() {
        sessionStorage.login(
          $scope.user.email,
          $scope.user.password
        )
        .then(function() {
          notify.success('Successfully logged in.');
          $state.go('items');
        }, function(error) {
          notify.error(error.message);
        });
      };
    }
  };
});
