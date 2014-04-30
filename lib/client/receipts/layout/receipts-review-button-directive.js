var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').directive('receiptsReviewButton', function(
  receiptStorage
) {
  return {
    restrict: 'E',
    template: require('./receipts-review-button-template.html'),
    link: function($scope, $element) {
      $scope.unreviewedReceiptTally = true;
      console.log($scope.receipts);
      console.log($scope.receipts.reviewer);
    }
  };
});



