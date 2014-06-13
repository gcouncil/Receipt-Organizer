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
    scope: true,
    link: function($scope, $element, $attributes) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
        $scope.categories = _.cloneDeep($scope.currentUser.settings.categories);
      });

      $scope.create = function() {
        var newCategory = $scope.newCategory;
        $scope.categories.push({ name: $scope.newCategory });
        notify.success('Added the ' + newCategory + ' category.');
        $scope.newCategory = null;
      };

      $scope.saveCategories = function() {
        $scope.currentUser.settings.categories = $scope.categories;
        userStorage.updateSettings($scope.currentUser).then(function(result) {
          currentUser.set(result);
          notify.success('Saved your category preferences.');
        });
      };

      $scope.cancel = function() {
        notify.info('Your changes were canceled.');
        $state.go('items');
      };

      $scope.delete = function(category) {
        var categoryName = category.name;
        _.remove($scope.categories, function(category_) {
          category_ = _.omit(category_, '$$hashKey');
          return _.isEqual(category_.name, categoryName);
        });
        notify.success('Deleted the ' + categoryName + ' category.');
      };
    }
  };
});
