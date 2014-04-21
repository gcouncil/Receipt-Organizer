var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').directive('receiptsToolbar', function(confirmation, receiptStorage) {
  return {
    restrict: 'E',
    template: require('./receipts-toolbar.html')
  };
});
