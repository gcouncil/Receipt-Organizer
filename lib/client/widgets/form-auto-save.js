var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('formAutoSave', function($parse, $q) {
  return {
    restrict: 'AC',
    require: 'form',
    compile: function($element, attr) {
      var fn = $parse(attr.formAutoSave);
      return function($scope, $element, $attributes, ngFormController) {
        $element.on('blur', '*', function(event) {
          if (ngFormController.$valid && ngFormController.$dirty) {
            $scope.$apply(function() {
              fn($scope);

              // TODO: Would be nice to have this wait until the save is
              // successful, but that creates a race condition between the
              // save and further user edits
              ngFormController.$setPristine();
            });
          }
        });
      };
    }
  };
});
