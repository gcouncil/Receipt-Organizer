var $ = require('jquery');
var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('formGroup', function($timeout) {
  return {
    restrict: 'EAC',
    require: '^?form',
    link: function($scope, $element, attributes, formController) {
      var ngModelController = $element.find('*').filter(function() {
        return !!$(this).data('$ngModelController');
      }).data('$ngModelController');

      if (!ngModelController) { return; }

      var visited = false;

      $element.on('blur', '*', function() {
        $scope.$apply(function() {
          visited = true;
          displayError();
        });
      });

      function error() {
        return (visited || ngModelController.$dirty) && ngModelController.$invalid;
      }

      function displayError() {
        $element.toggleClass('has-error', error());
      }

      var timeout;

      if (ngModelController) {
        $scope.$watch(error, function(invalid) {
          if (!invalid) {
            $timeout.cancel(timeout);
            displayError();
          } else {
            $timeout.cancel(timeout);
            timeout = $timeout(displayError, 1e3);
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
