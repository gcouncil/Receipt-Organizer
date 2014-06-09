var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.users.settings').directive('userSettings', function(
  notify,
  $state
){
  return {
    restrict: 'E',
    template: require('./user-settings-template.html'),
    controller: function($scope){

      $scope.$watch(function() {
        return $state.$current.name;
      }, function(page) {
        $scope.currentPage = page.split('.')[1];
      });

      $scope.isCurrentPage = function(name) {
        return $scope.currentPage === name;
      };

      $scope.categories = [
        'Airline',
        'Car Rental',
        'Convenience Store',
        'Entertainment',
        'Fuel/Auto',
        'General Retail',
        'Grocery',
        'Lodging/Hotel',
        'Meals/Restaurant',
        'Post/Shipping',
        'Software/Hardware',
        'Taxi',
        'Telecom',
        'Transportation',
        'Utility'
      ];

      $scope.fields = [
        'Custom Field 1',
        'Custom Field 2',
        'Custom Field 3',
        'Custom Field 4',
        'Custom Field 5',
      ];

      $scope.save = function() {
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
        notify.success('Deleted the ' + instance + ' ' + collection + '.');
      };
    }
  };
});
