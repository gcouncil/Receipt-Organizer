var angular = require('angular');
var $ = require('jquery');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function(
  $timeout,
  notify,
  storageEvents
) {
  return {
    restrict: 'E',
    template: require('./toplevel-layout-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.storageEvents = storageEvents;

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
          var tmp;
          $element.css('line-height', 1); // Ensure IE will decide a re-flow is needed
          tmp = $element[0].offsetWidth; // Force a re-flow
          $element.css('line-height', ''); // Restore correct styling
          tmp = $element[0].offsetWidth; // Force a re-flow, again with the restored styling
        }, 0, true);
      }
    }
  };
});
