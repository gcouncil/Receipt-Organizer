var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('input', function() {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function($scope, $element, $attributes, ngModelController) {
      if (!ngModelController || $attributes.type !== 'file') { return; }

      $element.on('change', function() {
        ngModelController.$setViewValue($element.prop('files'));
      });
    }
  };
});
