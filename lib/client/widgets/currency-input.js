var angular = require('angular');

function wrapInput(element) {
  var wrapper = angular.element(require('./currency-input.html'));
  element.after(wrapper);
  wrapper.append(element);
}

angular.module('epsonreceipts.widgets').directive('input', function() {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function($scope, element, attributes, ngModelController) {
      if (ngModelController && attributes.type === 'currency') {
        wrapInput(element);

        ngModelController.$formatters.push(function(value) {
          return angular.isNumber(value) ? value.toFixed(2) : value;
        });

        ngModelController.$parsers.unshift(function(value) {
          var number, valid;

          if (ngModelController.$isEmpty(value)) {
            number = null;
            valid = true;
          } else {
            number = parseFloat(value);
            valid = isFinite(number) && /^-?\d*\.?\d{0,2}$/.test(value);
          }

          ngModelController.$setValidity('currency', valid);

          return valid ? number : value;
        });

        element.on('blur', function() {
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
