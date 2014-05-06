var angular = require('angular');

angular.module('epsonreceipts.receiptsToolbar').directive('receiptsToolbar', function(
  confirmation,
  receiptStorage
) {
  return {
    restrict: 'E',
    template: require('./receipts-toolbar-template.html'),
  };
});
