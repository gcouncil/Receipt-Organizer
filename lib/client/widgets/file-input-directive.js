var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('input', function() {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function($scope, $element, $attributes, ngModelController) {
      if (!ngModelController || $attributes.type !== 'file') { return; }

      $element.on('change', function() {
        $scope.$apply(function() {
          // Convert FileList to a unique array so angular will see it as "changed"
          var files = [].slice.apply($element.prop('files'));
          ngModelController.$setViewValue(files);
        });
      });
    }
  };
});
