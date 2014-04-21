var angular = require('angular');

angular.module('epsonreceipts.receipts.thumbnail').directive('receiptThumbnail', function(
  $controller
) {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail.html'),
    scope: {
      receipt: '=',
      selection: '='
    },
    controller: function($scope) {
      $scope.imageLoader = $controller('ImageLoaderController', {
        $scope: $scope,
        options: {
          receipt: 'receipt',
          image: 'image'
        }
      });
    }
  };
});

