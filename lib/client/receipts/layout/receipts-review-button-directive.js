var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').directive('receiptsReviewButton', function(
  receiptStorage
) {
  return {
    restrict: 'E',
    template: require('./receipts-review-button-template.html'),
    link: function($scope, $element) {
      $scope.unreviewedReceiptTally = true;
      var receipts = $scope.receipts;
      $scope.receipts = receipts;
      console.log($element);
      console.log(receipts);
    }
  };
});



