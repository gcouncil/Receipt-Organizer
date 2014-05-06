var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receiptThumbnail').directive('receiptThumbnailGrid', function($interval) {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail-grid-template.html'),
    scope: {
      'receipts': '=',
      'selection': '=',
      'pagination': '='
    },
    link: function($scope, $element, $attributes) {
      var width, height;
      $interval(function() {
        width = $element.width();
        height = $element.height();
      }, 100);

      $scope.$watch(function() { return width; }, update);
      $scope.$watch(function() { return height; }, update);
      $scope.$watch('pagination', update);

      function update() {
        if (!$scope.pagination) { return; }

        var columns = Math.floor(width / 376);
        var rows = Math.floor(height / 216);

        var perPage = Math.max(columns, 1) * Math.max(rows, 1);

        if (_.isFinite(perPage)) {
          $scope.pagination.setLimit(perPage);
        }
      }
    }
  };
});
