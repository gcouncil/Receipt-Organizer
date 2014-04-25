var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('datepicker', function(
  $datepicker,
  $dateParser,
  dateFilter
) {
  return {
    restrict: 'E',
    require: '?ngModel',
    template: require('./datepicker-template.html'),
    replace: true,
    scope: {
      value: '=ngModel'
    },
    link: {
      pre: function($scope, $element, $attrs, ngModelController) {
        // TODO: This is an ugly way to expose the ngModelController to the input element, but it's the only way I could find
        $element.find('input').data('$ngModelController', ngModelController);
      }
    }
  };
});
