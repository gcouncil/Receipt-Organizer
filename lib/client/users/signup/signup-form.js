var angular = require('angular');

angular.module('epsonreceipts.users.signup-form').directive('signupForm', function() {
  return {
    restrict: 'E',
    template: require('./signup-form.html'),
    controller: function($scope, userStorage) {
      $scope.create = function() {
        console.log('HELLO');
        userStorage.create($scope.user);
      };
    }
  };
});
