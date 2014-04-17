var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('formConfirmLeave', function() {
  /* global confirm */

  return {
    restrict: 'AC',
    require: 'form',
    link: function($scope, $element, $attributes, ngFormController) {
      $scope.$on('$stateChangeStart', function(event) {
        if (ngFormController.$dirty && !event.confirmed) {
          var response = confirm('There are unsaved changes, are you sure you want to continue without saving?');
          if (!response) {
            event.preventDefault();
          }
          event.confirmed = true;
        }
      });
    }
  };
});
