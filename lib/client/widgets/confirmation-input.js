var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('confirmationInput', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      original: '=confirmationInput'
    },
    link: function($scope, element, attributes, ngModelController) {
      $scope.$watch('original', function() {
        if (ngModelController.$dirty) {
          ngModelController.$setViewValue(ngModelController.$viewValue);
        }
      });

      ngModelController.$parsers.push(function(value) {
        if (value === $scope.original) {
          ngModelController.$setValidity('confirmationInput', true);
          return value;
        } else {
          ngModelController.$setValidity('confirmationInput', false);
          return undefined;
        }
      });
    }
  };
});
