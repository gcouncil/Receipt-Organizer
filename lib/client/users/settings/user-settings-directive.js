var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.users.settings').directive('userSettings', function(
  notify,
  currentUser,
  userStorage,
  $state
){
  return {
    restrict: 'E',
    template: require('./user-settings-template.html'),
    controller: function($scope){
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
        debugger;
        $scope.categories = $scope.currentUser.settings.categories;
      });

      $scope.$watch(function() {
        return $state.$current.name;
      }, function(page) {
        $scope.currentPage = page.split('.')[1];
      });

      $scope.isCurrentPage = function(name) {
        return $scope.currentPage === name;
      };


      $scope.fields = [
        'Custom Field 1',
        'Custom Field 2',
        'Custom Field 3',
        'Custom Field 4',
        'Custom Field 5',
      ];

      $scope.save = function() {
        $scope.currentUser.settings.categories = $scope.categories;
        userStorage.updateSettings.then(function(user) {
          currentUser.set(user);
        });
        notify.success('Saved your ' + $scope.currentPage.replace('-', ' ') +' preferences.');
      };

      $scope.cancel = function() {
        notify.info('Your changes were cancelled.');
        $state.go('items');
      };

      $scope.delete = function(collection, instance) {
        _.remove($scope[collection], function(model) {
          return model === instance;
        });
        var type = (collection === 'categories') ? 'category' : 'field';
        notify.success('Deleted the ' + instance + ' ' + type + '.');
      };
    }
  };
});
