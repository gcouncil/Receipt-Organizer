var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('formGroup', function($timeout) {
  return {
    restrict: 'EAC',
    require: '^?form',
    link: function($scope, element, attributes, formController) {
      var input = element.find('input');
      var ngModelController = input.controller('ngModel');

      input.on('blur', function() {
        $scope.$apply(function() {
          ngModelController.$dirty = true;
          displayError();
        });
      });

      function error() {
        return ngModelController.$dirty && ngModelController.$invalid;
      }

      function displayError() {
        element.toggleClass('has-error', error());
      }

      var timeout;
      if (ngModelController) {
        $scope.$watch(error, function(invalid) {
          if (!invalid) {
            $timeout.cancel(timeout);
            displayError();
          }
        });

        $scope.$watch(function() {
          return ngModelController.$viewValue;
        }, function() {
          $timeout.cancel(timeout);
          timeout = $timeout(displayError, 1e3);
        });
      }
    }
  };
});
