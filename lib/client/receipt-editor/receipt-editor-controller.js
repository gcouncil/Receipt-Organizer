var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receiptEditor').controller('ReceiptEditorController', function(
  $scope,
  deferred,
  $controller,
  $q,
  receipts,
  receiptStorage
) {
  $scope.pagination = $controller('PaginationController', { $scope: $scope });
  $scope.pagination.setLimit(1);
  $scope.pagination.on('change', function() {
    $scope.receipt = $scope.pagination.items[0];
  });
  $scope.pagination.setItems(receipts);

  $scope.unreviewed = {};

  $scope.save = function() {
    var promises = _.each(receipts, function(receipt) {
      receipt.reviewed = !$scope.unreviewed[receipt.id];
      return receiptStorage.persist(receipt);
    });

    $q.all(promises).then(function() {
      console.log('Success');
      deferred.resolve();
    }, function() {
      console.log('Error');
    });
  };

  $scope.cancel = function() {
    deferred.reject();
  };

  $scope.imageLoader = $controller('ImageLoaderController', {
    $scope: $scope,
    options: {
      receipt: 'receipt',
      image: 'image'
    }
  });

});
