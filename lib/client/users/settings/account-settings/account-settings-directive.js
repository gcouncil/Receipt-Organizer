var angular = require('angular');

angular.module('epsonreceipts.users.settings').directive('accountSettings', function() {
  return {
    restrict: 'E',
    template: require('./account-settings-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.card = {};
      $scope.user = {};
    }
  };
});
