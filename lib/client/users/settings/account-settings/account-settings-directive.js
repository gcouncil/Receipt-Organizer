var angular = require('angular');

angular.module('epsonreceipts.users.settings').directive('accountSettings', function(
  $state,
  notify,
  currentUser,
  userStorage
) {
  return {
    restrict: 'E',
    template: require('./account-settings-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.user = user;
      });

      $scope.save = function() {
        // TODO
      };

      $scope.cancel = function() {
        notify.info('Your changes were cancelled.');
        $state.go('items');
      };
    }
  };
});
