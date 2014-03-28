var angular = require('angular');

angular.module('epsonreceipts.receipts.editor').directive('receiptFields', function() {
  return {
    restrict: 'EA',
    template: require('./receipt-fields.html'),
    scope: {
      receipt: '=',
    }
  };
});

