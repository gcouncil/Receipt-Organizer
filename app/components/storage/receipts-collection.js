var angular = require('angular');
var _ = require('lodash');

function ReceiptManager() {
  this.all = {};
}

_.extend(ReceiptManager.prototype, {
  add: function(receipt) {

    this.all[receipt.id] = receipt;
  },
  query: function() {}
});

angular.module('epsonreceipts.storage').service('ReceiptManager', ReceiptCollection);
