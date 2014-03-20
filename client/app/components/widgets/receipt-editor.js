var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').factory('receiptEditor', function($modal) {
  return {
    open: function(receipt) {
      var modal = $modal.open({
        backdrop: 'static',
        windowClass: 'receipt-editor-window',
        template: require('./receipt-editor.html'),
        resolve: {
          receipt: function() { return receipt.clone(); }
        },
        controller: function($scope, receipt) {
          $scope.receipt = receipt;

          $scope.ok = function() {
            $scope.$close($scope.receipt);
          };

          $scope.cancel = function() {
            $scope.$dismiss('cancel');
          };
        }
      });

      return modal;
    }
  };
});
