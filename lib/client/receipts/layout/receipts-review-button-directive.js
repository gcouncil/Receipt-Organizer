var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').directive('receiptsReviewButton', function() {
  return {
    restrict: 'E',
    template: require('./receipts-review-button-template.html'),
    scope: {
      reviewer: '='
    },
    link: function($scope) {
      $scope.unreviewedReceiptTally = true;
      console.log($scope.reviewer);
    }
  };
});



