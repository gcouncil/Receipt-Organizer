var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('formGroup', function() {
  return {
    restrict: 'EAC',
    link: function($scope, element, attributes) {
      var ngModelController = element.find('input').controller('ngModel');

      if (ngModelController) {
        $scope.$watch(function() {
          return ngModelController.$invalid;
        }, function(invalid) {
          element.toggleClass('has-error', invalid);
        });
      }
    }
  };
});
