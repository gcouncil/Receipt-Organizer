var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.scanning').directive('scanButton', function() {
  return {
    restrict: 'E',
    template: require('./scan-button.html'),
    controller: function($scope, domain, receiptStorage, receiptEditor) {
      _.extend($scope, {
        scan: function() {
        },
        import: function() {
        },
        create: function() {

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
      });
    }
  };
});
