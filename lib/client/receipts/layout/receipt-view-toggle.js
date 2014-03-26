var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').directive('receiptViewToggle', function() {
  return {
    restrict: 'E',
    template: require('./receipt-view-toggle.html')
  };
});
