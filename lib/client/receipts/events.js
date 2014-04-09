var angular = require('angular');

angular.module('epsonreceipts.receipts').run(function($rootScope, receiptEditor, receiptStorage) {
  $rootScope.$on('receipts.edit', function($event, receipt) {
    var modal = receiptEditor.open(receipt);
    modal.result.then(function(receipt) {
      receiptStorage.update(receipt);
    });
  });

  $rootScope.$on('receipts.destroy', function($event, receipt) {
    receiptStorage.destroy(receipt);
  });
});
