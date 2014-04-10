var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts.table').directive('receiptTable', function() {
  return {
    restrict: 'E',
    template: require('./receipt-table.html'),
    scope: {
      receipts: '='
    },

    controller: function($scope, receiptEditor, receiptDelete, receiptStorage) {
      $scope.selected = {};

      $scope.selectReceipt = function(receipt, selected) {
        if (selected) {
          $scope.selected[receipt.id] = receipt;
        } else {
          delete $scope.selected[receipt.id];
        }
      };

      $scope.deleteSelection = function() {
        var modal = receiptDelete.open($scope.selected);
        modal.result.then(function() {
          _.each($scope.selected, function(receipt) {
            receiptStorage.destroy(receipt);
          });
          $scope.selected = {};
        });
      };

      $scope.isDisabled = function() {
        return !_.any($scope.selected);
      };
    }
  };
});
