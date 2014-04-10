var angular = require('angular');

angular.module('epsonreceipts.receipts.delete').factory('receiptDelete', function($modal) {
  return {
    open: function(receipts) {
      var modal = $modal.open({
        backdrop: 'static',
        windowClass: 'receipt-delete-window',
        template: '<receipt-delete></receipt-delete>',
        controller: function($scope) {
          $scope.receiptCount = Object.keys(receipts).length;
        }
      });
      return modal;
    }
  };
});

angular.module('epsonreceipts.receipts.delete').directive('receiptDelete', function() {
  return {
    restrict: 'E',
    template: require('./receipt-delete.html'),
    controller: function($scope) {
      $scope.ok = function() {
        $scope.$close();
      };

      $scope.cancel = function() {
        $scope.$dismiss('cancel');
      };
    }
  };
});
