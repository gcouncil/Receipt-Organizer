var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('confirmationInput', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      original: '=confirmationInput'
    },
    link: function($scope, element, attributes, ngModelController) {
      function validate() {
        var valid = ngModelController.$modelValue === $scope.original;
        ngModelController.$setValidity('confirmationInput', valid);
      }

      $scope.$watch('original', validate);
      ngModelController.$viewChangeListeners.push(validate);
    }
  };
});
