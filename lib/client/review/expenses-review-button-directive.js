var angular = require('angular');

angular.module('epsonreceipts.review').directive('receiptsReviewButton', function() {
  return {
    restrict: 'E',
    template: require('./receipts-review-button-template.html'),
    scope: {
      review: '='
    }
  };
});
