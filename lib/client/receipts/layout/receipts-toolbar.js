var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts.layout').directive('receiptsToolbar', function() {
  return {
    restrict: 'E',
    template: require('./receipts-toolbar.html'),
    controller: function($scope, receiptStorage, receiptDelete) {
      $scope.destroy = function() {
        receiptDelete.open($scope.receipts.selection).result.then(function() {
          _.each($scope.receipts.selection, function(receipt) {
            receiptStorage.destroy(receipt);
          });
        });
      };
    }
  };
});
