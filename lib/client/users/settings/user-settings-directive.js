var angular = require('angular');
angular.module('epsonreceipts.users.settings').directive('userSettings', function(
  notify,
  $state
){
  return {
    restrict: 'E',
    template: require('./user-settings-template.html'),
    link: function($scope, $element, $attributes){

      $scope.$watch(function() {
        return $state.$current.name;
      }, function(page) {
        $scope.currentPage = page.split('.')[1];
      });

      $scope.isCurrentPage = function(name) {
        return $scope.currentPage === name;
      };

      $scope.categories = [
        {visible: true, name: 'Airline'},
        {visible: true, name: 'Car Rental'},
        {visible: true, name: 'Convenience Store'},
        {visible: true, name: 'Entertainment'},
        {visible: true, name: 'Fuel/Auto'},
        {visible: true, name: 'General Retail'},
        {visible: true, name: 'Grocery'},
        {visible: true, name: 'Lodging/Hotel'},
        {visible: true, name: 'Meals/Restaurant'},
        {visible: true, name: 'Post/Shipping'},
        {visible: false, name: 'Software/Hardware'},
        {visible: true, name: 'Taxi'},
        {visible: true, name: 'Telecom'},
        {visible: true, name: 'Transportation'},
        {visible: true, name: 'Utility'}
      ];

      $scope.fields = [
        {visible: false, name: ''},
        {visible: false, name: ''},
        {visible: false, name: ''},
        {visible: false, name: ''},
        {visible: false, name: ''},
      ];

      var firstHalfLength = $scope.categories.length / 2;

      $scope.categories.firstHalfSet = $scope.categories.splice(0, firstHalfLength);
      $scope.categories.secondHalfSet = $scope.categories;

      $scope.save = function() {
        notify.success('Saved your ' + $scope.currentPage.replace('-', ' ') +' preferences.');
      };

      $scope.cancel = function() {
        notify.info('Your changes were cancelled.');
      };
    }
  };
});
