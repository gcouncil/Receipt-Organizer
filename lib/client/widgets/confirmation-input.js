var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('confirmationInput', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, element, attributes, ngModelController) {
      ngModelController.$parsers.push(function(value) {
        if (value === $scope['user']['password']) {
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
