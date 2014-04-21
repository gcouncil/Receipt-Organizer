var angular = require('angular');

angular.module('epsonreceipts.users.login-form').directive('loginForm', function(
  sessionStorage
) {
  return {
    restrict: 'E',
    template: require('./login-form.html'),
    link: function($scope) {
      $scope.submit = function() {
        sessionStorage.login(
          $scope.user.email,
          $scope.user.password
        );
      };
    }
  };
});
