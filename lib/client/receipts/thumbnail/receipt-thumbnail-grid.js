var angular = require('angular');

angular.module('epsonreceipts.receipts.thumbnail').directive('receiptThumbnailGrid', function() {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail-grid.html'),
    link: function($scope, $element, $attributes) {
      var $window = angular.element(window);

      function update() {
        $scope.$apply(function() {
          var width = $element.width();
          var height = $element.height();
          $scope.receipts.perPage = Math.floor(width / 370) * Math.floor(height / 210);
        });
      }

      $window.bind('resize', update);
      $scope.$on('destroy', function() {
        $window.unbind('resize', update);
      });

      function wait() {
        if ($element.height() > 0) {
          update();
        } else {
          setTimeout(wait, 50);
        }
      }
      setTimeout(wait, 100);
    }
  };
});
