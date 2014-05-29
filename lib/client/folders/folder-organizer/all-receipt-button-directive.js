var angular = require('angular');

angular.module('epsonreceipts.folders.all-receipt-button').directive('allReceiptButton', function() {
  return {
    restrict: 'E',
    template: require('./all-receipt-button-template.html'),
    replace: true,
    controller: function($scope, itemStorage) {
      itemStorage.watch($scope, function(items) {
        $scope.allItems = items;
      });
    }
  };
});

