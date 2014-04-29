var angular = require('angular');

angular.module('epsonreceipts.receiptsToolbar').directive('receiptsReviewButton', function(
  receiptStorage
) {
  return {
    restrict: 'E',
    template: require('./receipts-toolbar-review-button-template.html'),
  };
});
