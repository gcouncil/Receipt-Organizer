var angular = require('angular');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function() {
  return {
    restrict: 'E',
    template: require('./toplevel-layout.html'),
    controller: function($scope, domain, receiptEditor, receiptStorage) {
      $scope.delegate = {
        createReceipt: function() {
          var receipt = new domain.Receipt({
            date: new Date(),
            total: 42.99,
            type: 'Unknown',
            category: 'None'
          });

          var modal = receiptEditor.open(receipt);

          modal.result.then(function(receipt) {
            receiptStorage.create(receipt);
          });
        }
      };
    }
  };
});
