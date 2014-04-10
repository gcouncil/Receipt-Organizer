var angular = require('angular');

angular.module('epsonreceipts.receipts.thumbnail').directive('receiptThumbnailGrid', function() {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail-grid.html'),
    link: function($scope, $element, $attributes) {
      $scope.$watch(function() {
        return $element[0].offsetWidth;
      }, function(width) {
        $scope.receipts.perPage = Math.floor(width / 370) * 3;
      });
    }
  };
});
