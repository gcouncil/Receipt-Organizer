var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() {
  return require('epson-receipts/domain');
});

var images = [];
angular.module('epsonreceipts.storage').factory('receiptStorage', function(domain, $http, $q) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    return $http.get('/api/receipts').then(function(result) {
      var receipts = _.map(result.data, function(data, i) {
        var receipt = new domain.Receipt(data);

        receipt.image = images[i];

        return receipt;
      });
      return receipts;
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

    fetch: function(options, callback) {
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
      $http.delete('/api/receipts/' + receipt.id, receipt).then(function(result) {
        notify();
      });
    }
  };
});


angular.module('epsonreceipts.storage').factory('imageStorage', function(domain, $q) {

  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    var deferred = $q.defer();

    deferred.resolve(images);

    if (callback) { deferred.then(callback); }

    return deferred.promise;
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

    create: function(image) {
      images.push(image);
      notify();
    }
  };
});

