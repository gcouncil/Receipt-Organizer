var angular = require('angular');
var _ = require('lodash');

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
        $scope.currentUser = user;
        $scope.user = user.clone()
      });

      $scope.save = function() {
        userStorage.update($scope.user).then(function(result) {
          currentUser.set(result);
          notify.success('Saved your settings.');
        }, function(err) {
          notify.error(err.data.message);
        });
      };

      $scope.cancel = function() {
        notify.info('Your changes were cancelled.');
        $state.go('items');
      };
    }
  };
});
