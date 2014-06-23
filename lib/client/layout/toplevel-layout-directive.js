var angular = require('angular');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function(
  $timeout,
  notify
) {
  return {
    restrict: 'E',
    template: require('./toplevel-layout-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.items.on('resetScroll', function() {
        $element.find('.toplevel-layout-body').scrollTop(0);
      });

      var $window = $(window);
      $window.on('resize', forceLayout);
      $scope.$on('$destroy', function() {
        $window.off('resize', forceLayout);
      });

      // Hack to prevent thumbnails/list from disappearing in IE10 when the window is maximized
      function forceLayout() {
        $timeout(function() {
          $element.css('line-height', 1); // Ensure IE will decide a re-flow is needed
          $element[0].offsetWidth; // Force a re-flow
          $element.css('line-height', ''); // Restore correct styling
          $element[0].offsetWidth; // Force a re-flow, again with the restored styling
        }, 0, true);
      }
    }
  };
});
