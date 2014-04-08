var angular = require('angular');

angular.module('epsonreceipts.receipts.thumbnail').directive('receiptThumbnail', function() {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail.html'),
    scope: {
      receipt: '=',
      datastore: '='
    },
    controller: function($scope, receiptEditor, receiptStorage, imageStorage) {
      $scope.$watch('receipt.image', function(imageId) {
        $scope.image = null;
        $scope.loading = true;
        imageStorage.fetch({ id: imageId }).then(function(image) {
          $scope.image = image;
          $scope.loading = false;
        });
      });
    }
  };
});

