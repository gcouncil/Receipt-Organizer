var angular = require('angular');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function(
  notify
) {
  return {
    restrict: 'E',
    template: require('./toplevel-layout-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.items.on('resetScroll', function() {
        $element.find('.toplevel-layout-body').scrollTop(0);
      });
    }
  };
});
