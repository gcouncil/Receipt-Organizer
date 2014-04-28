var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('datepicker', function(
  $datepicker,
  $dateParser,
  dateFilter
) {
  return {
    restrict: 'E',
    template: require('./datepicker-template.html'),
    replace: true,
    scope: {
      value: '=ngModel'
    }
  };
});
