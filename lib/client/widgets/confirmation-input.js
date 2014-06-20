var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('confirmationInput', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      original: '=confirmationInput'
    },
    link: function($scope, element, attributes, ngModelController) {
      function validate(model, value) {
        return value === $scope.original;
      }

      ngModelController.$validators.confirmationInput = validate;

      $scope.$watch('original', function() {
        ngModelController.$validate();
      });
    }
  };
});
