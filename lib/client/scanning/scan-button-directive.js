var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.scanning').directive('scanButton', function(
  $interval,
  twain,
  $templateCache,
  $dropdown
) {
  var templateId = _.uniqueId('template');
  $templateCache.put(templateId, require('./scan-button-dropdown-template.html'));

  return {
    restrict: 'E',
    template: require('./scan-button-template.html'),
    link: function($scope, $element) {
      var dropdown = $scope.dropdown = $dropdown($element, {
        scope: $scope,
        trigger: 'manual',
        template: templateId
      });

      dropdown.$scope.fileInputId = $scope.fileInputId = _.uniqueId('fileInput');

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      $scope.twain = dropdown.$scope.twain = twain;

      dropdown.$scope.select = function(driver) {
        twain.driver = driver;
      };

      $scope.shortDriverName = function() {
        return twain.driver.replace(/^EPSON /, '');
      };

      dropdown.$scope.isSelected = function(driver) {
        return twain.driver === driver;
      };

      $scope.$watch(function() {
        return twain.isBusy;
      }, function(busy) {
        $scope.scannerBusy = busy;
      });

    }
  };
});
