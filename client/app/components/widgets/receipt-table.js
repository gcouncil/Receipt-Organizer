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
      $scope.edit = function() {
        var modal = receiptEditor.open($scope.receipt);
        modal.result.then(function(receipt) {
          receiptStorage.update(receipt);
        });
      };
      $scope.destroy = function() {
        receiptStorage.destroy($scope.receipt);
      };
    }

  };
});