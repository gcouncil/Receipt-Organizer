var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('receiptTable', function() {
  return {
    restrict: 'E',
    template: require('./receipt-table.html'),
    scope: {
      receipts: '=',
      datastore: '='
    },
    controller: function($scope, receiptEditor, receiptStorage) {
      $scope.grid = {
        data: 'receipts',
        columnDefs: [{
          field: 'date',
          displayName: 'Date',
          cellFilter: 'date'
        }, {
          field: 'total',
          displayName: 'total',
          cellFilter: 'currency'
        }, {
          field: 'paymentType',
          displayName: 'Payment Type'
        }, {
          field: 'category',
          displayName: 'Category'
        }]
      };
      $scope.edit = function(receipt) {
        var modal = receiptEditor.open(receipt);
        modal.result.then(function(receipt) {
          receiptStorage.update(receipt);
        });
      };
      $scope.destroy = function(receipt) {
        receiptStorage.destroy(receipt);
      };
    }

  };
});
