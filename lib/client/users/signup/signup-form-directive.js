var angular = require('angular');

angular.module('epsonreceipts.users.signup').directive('signupForm', function(
  $state,
  sessionStorage,
  userStorage,
  currentUser,
  notify
) {
  return {
    restrict: 'E',
    template: require('./signup-form-template.html'),
    link: function($scope) {
      $scope.submit = function() {
        userStorage.create($scope.user).then(function(user) {
          currentUser.set(user);
          notify.success('Successfully signed up!');
          $state.go('items');
        }, function(response) {
          notify.error(response.data.message);
        });
      };
    }
  };
});
