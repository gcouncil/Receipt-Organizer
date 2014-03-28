var angular = require('angular');

angular.module('epsonreceipts.users.signup-form').directive('signupForm', function() {
  return {
    restrict: 'E',
    template: require('./signup-form.html'),
    controller: function($scope, $state, userStorage) {
      $scope.submit = function() {
        userStorage.create($scope.user);
        $state.go('receipts.thumbnails');
      };
    }
  };
});
