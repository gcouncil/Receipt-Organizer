var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts.table').directive('receiptTable', function() {
  return {
    restrict: 'E',
    template: require('./receipt-table.html'),
    scope: {
      receipts: '=',
      datastore: '='
    },
    controller: function($scope, receiptEditor, receiptStorage) {
      $scope.selected = {};

      $scope.selectReceipt = function(receipt, $event) {
        if (angular.element($event.target).val()) {
          $scope.selected[receipt.id] = receipt;
        } else {
          delete $scope.selected[receipt.id];
        }
      };

      $scope.deleteSelection = function() {
        _.each($scope.selected, function(receipt) {
          receiptStorage.destroy(receipt);
        });
        $scope.selected = {};
      };

      $scope.isDisabled = function() {
        return !_.any($scope.selected);
      };
    }
  };
});
