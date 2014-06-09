var angular = require('angular');

angular.module('epsonreceipts.users.settings').directive('newSettingsInput', function() {
  return {
    restrict: 'E',
    template: require('./new-settings-input-template.html'),
    require: '^userSettings',
    replace: true,
    scope: {
      collection: '='
    },
    link: function($scope, $element, $attributes, userSettingsController) {
      $scope.newSetting = null;

      $scope.create = function() {
        $scope.collection.push($scope.newSetting);
        $scope.newSetting = null;
      };
    }
  };
});
