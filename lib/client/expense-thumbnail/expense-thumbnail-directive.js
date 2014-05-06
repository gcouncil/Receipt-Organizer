var angular = require('angular');

angular.module('epsonreceipts.receiptThumbnail').directive('receiptThumbnail', function(
  $controller
) {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail-template.html'),
    scope: {
      receipt: '=',
      selection: '='
    },
    link: function($scope, $element) {
      $scope.imageLoader = $controller('ImageLoaderController', {
        $scope: $scope,
        options: {
          receipt: 'receipt',
          image: 'image'
        }
      });

      $scope.$watch('receipt.reviewed', function(reviewed) {
        $element.toggleClass('receipt-thumbnail-reviewed', reviewed);
        $element.toggleClass('receipt-thumbnail-unreviewed', !reviewed);
      });
    }
  };
});

