var angular = require('angular');
angular.module('epsonreceipts.users.settings').directive('userSettings', function(){
  return {
    restrict: 'E',
    template: require('./user-settings-template.html'),
    link: function($scope, $element, $attributes){
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

      var firstHalfLength = $scope.categories.length / 2;

      $scope.categories.firstHalfSet = $scope.categories.splice(0, firstHalfLength);
      $scope.categories.secondHalfSet = $scope.categories;
    }
  };
});
