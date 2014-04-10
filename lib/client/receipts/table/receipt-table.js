var angular = require('angular');

angular.module('epsonreceipts.receipts.table').directive('receiptTable', function() {
  return {
    restrict: 'E',
    template: require('./receipt-table.html'),
    scope: {
      receipts: '=',
      datastore: '='
    },
  };
});
