var angular = require('angular');

angular.module('epsonreceipts.users.settings').directive('accountSettings', function(
  $state,
  notify,
  currentUser,
  userStorage,
  offlineStorage
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
        if ($scope.user.password && $scope.user.password !== $scope.user.passwordConfirmation) {
          notify.error('Passwords do not match!');
          return;
        }
        userStorage.update($scope.user).then(function(result) {
          currentUser.set(result);
          notify.success('Saved your settings.');
          $scope.form.$setPristine();
        }, function(err) {
          notify.error(err.data.message);
        });
      };

      $scope.cancel = function() {
        notify.info('Your changes were cancelled.');
        $state.go('items');
      };

      $scope.isFormDisabled = function() {
        return offlineStorage.isOffline() || $scope.form.$invalid || $scope.form.$pristine;
      };
    }
  };
});
