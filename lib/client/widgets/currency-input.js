var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('input', function(
  $filter
) {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function($scope, element, attributes, ngModelController) {
      if (ngModelController && attributes.type === 'currency') {

        ngModelController.$formatters.push(function(value) {
          return angular.isNumber(value) ? $filter('currency')(value, '$') : value;
        });

        var validate = function(number, value)  {
          var valid;

          if (ngModelController.$isEmpty(value)) {
            valid = true;
          } else {
            valid = isFinite(number) && /^\$?(\d|,)*\.?\d{0,2}$/.test(value);
          }

          return valid;
        };

        ngModelController.$parsers.push(function(value) {
          var number = parseFloat(value.replace(/\$|,/g, ''));
          // Return NaN if invalid since $validators are NOT re-run if the parsed value does not change
          return validate(number, value) ? number : NaN;
        });

        ngModelController.$validators.currency = validate;
        element.on('blur', function() {
          if (ngModelController.$invalid) { return; }

          var value = ngModelController.$modelValue;
          angular.forEach(ngModelController.$formatters, function(formatter) {
            value = formatter(value);
          });
          ngModelController.$viewValue = value;
          ngModelController.$render();
        });
      }
    }
  };
});
