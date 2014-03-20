var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage', []);


angular.module('epsonreceipts.storage').factory('domain', function() {
  return require('epson-receipts-domain');
});

angular.module('epsonreceipts.storage').factory('receiptStorage', function() {
  var receipts = [];

  var sequence = 0;
  function notify() {
    sequence++;
  }

  return {
    query: function(options, callback) {
      // Register callback
      if (options.scope && callback) {
        options.scope.$watch(
          function() { return sequence; },
          function() {
            callback(receipts);
          }
        );
      }

      if (callback) {
        callback(receipts);
      }
    },

    fetch: function(options, callback) {
    },

    create: function(receipt) {
      receipts.push(receipt.clone());
      notify();
    },

    update: function(receipt) {
      receipts = _.map(receipts, function(candidate) {
        return candidate.id === receipt.id ? receipt : candidate;
      });
      notify();
    },

    destroy: function(receipt) {
      _.remove(receipts, { id: receipt.id });
      notify();
    }
  };
});
