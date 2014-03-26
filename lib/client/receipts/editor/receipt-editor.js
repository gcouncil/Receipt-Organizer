var angular = require('angular');

angular.module('epsonreceipts.receipts.editor').factory('receiptEditor', function($modal) {
  return {
    open: function(receipt) {
      var modal = $modal.open({
        backdrop: 'static',
        windowClass: 'receipt-editor-window',
        template: '<receipt-editor receipt="receipt"></receipt-editor>',
        controller: function($scope) {
          $scope.receipt = receipt.clone();
        }
      });

      return modal;
    }
  };
});

angular.module('epsonreceipts.receipts.editor').directive('receiptEditor', function() {
  return {
    restrict: 'E',
    template: require('./receipt-editor.html'),
    controller: function($scope) {
      $scope.ok = function() {
        if ($scope.form.$valid) {
          $scope.$close($scope.receipt);
        }
      };

      $scope.cancel = function() {
        $scope.$dismiss('cancel');
      };
    }
  };

});
