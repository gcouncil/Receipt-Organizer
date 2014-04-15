var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('receiptStorage', function(domain, $http, $q) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    return $http.get('/api/receipts').then(function(result) {
      return _.map(result.data, function(data, i) {
        return new domain.Receipt(data);
      });
    });
  }

  // TODO: Handle error case
  return {
    query: function(options, callback) {
      // Register callback
      if (options.scope && callback) {
        options.scope.$watch(
          function() { return sequence; },
          function() {
            evaluateQuery(options).then(callback);
          }
        );
      } else {
        var result = evaluateQuery(options);
        if (callback) { result.then(callback); }
        return result;
      }
    },

    create: function(receipt) {
      $http.post('/api/receipts', receipt).then(function(result) {
        notify();
      });
    },

    update: function(receipt) {
      $http.put('/api/receipts/' + receipt.id, receipt).then(function(result) {
        notify();
      });
    },

    destroy: function(receipt) {
      $http.delete('/api/receipts/' + receipt.id).then(function(result) {
        notify();
      });
    }
  };
});

