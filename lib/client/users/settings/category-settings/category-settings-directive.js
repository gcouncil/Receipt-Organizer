var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.users.settings').directive('categorySettings', function(
  notify,
  currentUser,
  userStorage,
  $state
) {
  return {
    restrict: 'E',
    template: require('./category-settings-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
        $scope.categories = $scope.currentUser.settings.categories;
      });

      $scope.persistChanges = function(callback) {
        $scope.currentUser.settings.categories = $scope.categories;
        userStorage.updateSettings($scope.currentUser).then(function(result) {
          currentUser.set(result);
          callback();
        });
      };

      $scope.create = function() {
        var newCategory = $scope.newCategory;
        $scope.categories.push($scope.newCategory);
        $scope.persistChanges(function() {
          notify.success('Added the ' + newCategory + ' category.');
        });
        $scope.newCategory = null;
      };

      $scope.saveCategories = function() {
        $scope.persistChanges(function() {
          notify.success('Saved your category preferences.');
        });
      };

      $scope.cancel = function() {
        notify.info('Your changes were cancelled.');
        $state.go('items');
      };

      $scope.delete = function(category) {
        _.remove($scope.categories, function(category_) {
          return category_ === category;
        });
        $scope.persistChanges(function() {
          notify.success('Deleted the ' + category + ' category.');
        });
      };
    }
  };
});
