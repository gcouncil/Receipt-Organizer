var angular = require('angular');

angular.module('epsonreceipts.users.signup-form').directive('signupForm', function(
  $state,
  sessionStorage,
  userStorage,
  currentUser,
  notify
) {
  return {
    restrict: 'E',
    template: require('./signup-form.html'),
    link: function($scope) {
      $scope.submit = function() {
        userStorage.create($scope.user).then(function(user) {
          currentUser.set(user);
          notify.success('Successfully signed up!');
          $state.go('receipts.thumbnails');
        }, function(response) {
          notify.error(response.data.message);
        });
      };
    }
  };
});
