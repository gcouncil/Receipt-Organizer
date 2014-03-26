var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() {
  return require('epson-receipts/domain');
});

// angular.module('epsonreceipts.storage').factory('receiptStorage', function(domain, $http, $q) {
//   var receipts = [];

//   var sequence = 0;
//   function notify() {
//     sequence++;
//   }

//   function evaluateQuery(options, callback) {
//     return $http.get('/api/receipts').then(function(result) {
//       var receipts = _.map(result.data, function(data) { return new domain.Receipt(data); });
//       return receipts;
//     });
//   }

//   return {
//     query: function(options, callback) {
//       // Register callback
//       if (options.scope && callback) {
//         options.scope.$watch(
//           function() { return sequence; },
//           function() {
//             evaluateQuery(options).then(callback);
//           }
//         );
//       } else {
//         var result = evaluateQuery(options);
//         if (callback) { result.then(callback); }
//         return result;
//       }
//     },

//     fetch: function(options, callback) {
//     },

//     create: function(receipt) {
//       // TODO: Handle error case
//       $http.post('/api/receipts', receipt).then(function(result) {
//         notify();
//       });
//     },

//     update: function(receipt) {
//       receipts = _.map(receipts, function(candidate) {
//         return candidate.id === receipt.id ? receipt : candidate;
//       });
//       notify();
//     },

//     destroy: function(receipt) {
//       _.remove(receipts, { id: receipt.id });
//       notify();
//     }
//   };
// });

angular.module('epsonreceipts.storage').factory('receiptStorage', function(domain, $http, $q) {
  var receipts = [];

  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    var deferred = $q.defer();

    deferred.resolve(receipts);

    return deferred.promise;
  }

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

    fetch: function(options, callback) {
    },

    create: function(receipt) {
      receipt = receipt.clone();
      receipt.id = _.uniqueId('receipt');
      receipts.push(receipt);
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
