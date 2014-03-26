var angular = require('angular');

angular.module('epsonreceipts.receipts.editor').directive('receiptForm', function() {
  return {
    restrict: 'E',
    template: require('./receipt-form.html'),
    scope: {
      receipt: '=',
      form: '=name',
    }
  };
});

