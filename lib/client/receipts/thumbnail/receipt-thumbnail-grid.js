var angular = require('angular');

angular.module('epsonreceipts.receipts.thumbnail').directive('receiptThumbnailGrid', function($interval) {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail-grid.html'),
    link: function($scope, $element, $attributes) {
      var width, height;
      $interval(function() {
        width = $element.width();
        height= $element.height();
      }, 100);

      $scope.$watch(function() { return width; }, update);
      $scope.$watch(function() { return height; }, update);

      function update() {
        var perPage = Math.floor(width / 370) * Math.max(Math.floor(height / 210), 1);
        $scope.receipts.pagination.set({
          limit: perPage
        });
      }
    }
  };
});
