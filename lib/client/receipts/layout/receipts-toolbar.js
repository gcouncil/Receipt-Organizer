var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').directive('receiptsToolbar', function(confirmation, receiptStorage) {
  return {
    restrict: 'E',
    template: require('./receipts-toolbar.html'),
    controller: function($scope, receiptStorage, receiptDelete, tagStorage) {
      $scope.destroy = function() {
        receiptDelete.open($scope.receipts.selection.selectedItems).result.then(function() {
          _.each($scope.receipts.selection.selectedItems, function(receipt) {
            receiptStorage.destroy(receipt);
          });
        });
      };

      tagStorage.query({ scope: $scope }, function(tags) {
        $scope.tags = tags;
      });

      $scope.showingTags = false;
      $scope.toggleTagsPanel = function() {
        $scope.showingTags = !$scope.showingTags;
        return true;
      };

      $scope.showTag = function() {
        alert('Not yet implemented');
      };
    }
  };
});
