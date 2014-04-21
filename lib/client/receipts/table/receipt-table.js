var angular = require('angular');

angular.module('epsonreceipts.receipts.table').directive('receiptTable', function(
  receiptStorage
) {
  return {
    restrict: 'E',
    template: require('./receipt-table.html'),
    scope: {
      receipts: '=',
      selection: '='
    },

    link: function($scope) {
      $scope.update = function(receipt) {
        receiptStorage.update(receipt);
      };
    }
  };
});
