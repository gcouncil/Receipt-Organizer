var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').directive('receiptsLayout', function() {
  return {
    restrict: 'E',
    template: require('./receipts-layout.html'),
    controller: function($scope, $state, receiptStorage, receiptEditor) {
      $scope.page = 1;
      $scope.perPage = 10;
      $scope.allReceipts = [];

      function update() {
        $scope.receiptCount = $scope.allReceipts.length;
        $scope.receipts = $scope.allReceipts.slice(($scope.page - 1) * $scope.perPage, $scope.page * $scope.perPage);
      }

      receiptStorage.query({ scope: $scope }, function(receipts) {
        $scope.allReceipts = receipts;
        update();
      });

      $scope.$watch(function() {
        return $state.current.data.perPage;
      }, function(perPage) {
        $scope.perPage = perPage;
      });

      $scope.$watch('page', update);
      $scope.$watch('perPage', update);

      $scope.edit = function(receipt) {
        var modal = receiptEditor.open(receipt);
        modal.result.then(function(receipt) {
          receiptStorage.update(receipt);
        });
      };
      $scope.destroy = function(receipt) {
        receiptStorage.destroy(receipt);
      };
    },
  };
});
