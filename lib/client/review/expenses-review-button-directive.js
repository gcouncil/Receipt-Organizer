var angular = require('angular');

angular.module('epsonreceipts.review').directive('expensesReviewButton', function() {
  return {
    restrict: 'E',
    template: require('./expenses-review-button-template.html'),
    scope: {
      review: '='
    }
  };
});
