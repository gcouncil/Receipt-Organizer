var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('elastic', function(
  $interval
) {
  return {
    restrict: 'AC',
    require: '?ngModel',
    link: function($scope, $element, $attributes, ngModelController) {
      function update() {
        // Calculate offset for padding
        var offset = $element.height() - $element.innerHeight();

        // Prevent zero height from disrupting scroll
        $element.css({ marginBottom: $element.height() });

        // Zero height so that the element can shrink
        $element.height(0);

        // Calculate optimal height
        $element.height($element.prop('scrollHeight') + offset);

        // Remove margin hack from above
        $element.css({ marginBottom: 0 });
      }

      var interval = $interval(update, 100);
      $scope.$on('$destroy', function() {
        $interval.cancel(interval);
      });

      if (ngModelController) {
        ngModelController.$viewChangeListeners.push(update);
      }
    }
  };
});
