var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.users.settings').directive('formFieldSettings', function(
  notify,
  currentUser,
  userStorage,
  $state
) {
  return {
    restrict: 'E',
    template: require('./form-field-settings-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
        $scope.fields = $scope.currentUser.settings.fields;
      });

      $scope.persistChanges = function(callback) {
        $scope.currentUser.settings.fields = $scope.fields;
        userStorage.updateSettings($scope.currentUser).then(function(result) {
          currentUser.set(result);
          callback();
        });
      };

      $scope.saveFields = function() {
        $scope.persistChanges(function() {
          notify.success('Saved your form field preferences.');
        });
      };

      $scope.cancel = function() {
        notify.info('Your changes were cancelled.');
        $state.go('items');
      };
    }
  };
});
