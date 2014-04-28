var angular = require('angular');

angular.module('epsonreceipts.users.login-form').directive('loginForm', function(
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
          $state.go('receipts.thumbnails');
        }, function(error) {
          notify.error(error.message);
        });
      };
    }
  };
});
