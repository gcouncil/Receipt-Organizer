var angular = require('angular');

function wrapInput(element) {
  var wrapper = angular.element(require('./currency-input.html'));
  wrapper.insertBefore(element);
  element.appendTo(wrapper);
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

        ngModelController.$parsers.push(function(value) {
          var valid = /^-?\d+(\.\d{0,2})?$/.test(value);
          ngModelController.$setValidity('currency', valid || value === '-');
          return valid ? parseFloat(parseFloat(value).toFixed(2)) : value;
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
