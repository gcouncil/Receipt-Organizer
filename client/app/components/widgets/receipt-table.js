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
          cellFilter: 'date',
          minWidth: 120
        }, {
          field: 'vendor',
          displayName: 'Vendor',
          minWidth: 200
        }, {
          field: 'paymentType',
          displayName: 'Payment Type'
        }, {
          field: 'category',
          displayName: 'Category'
        }, {
          field: 'city',
          displayName: 'City'
        }, {
          field: 'state',
          displayName: 'State'
        }, {
          field: 'tax',
          displayName: 'Tax',
          cellFilter: 'currency'
        }, {
          field: 'additionalTax',
          displayName: 'Second Tax',
          cellFilter: 'currency'
        }, {
          field: 'tip',
          displayName: 'Tip',
          cellFilter: 'currency'
        }, {
          field: 'total',
          displayName: 'Total',
          cellFilter: 'currency'
        }, {
          field: 'taxCategory',
          displayName: 'Tax Category'
        }, {
          field: 'businessPurpose',
          displayName: 'Business Purpose'
        }, {
          field: 'reimbursable',
          displayName: 'Reimbursable'
        }, {
          field: 'billable',
          displayName: 'Billable'
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
