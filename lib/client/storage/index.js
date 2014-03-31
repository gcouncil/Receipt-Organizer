var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() {
  return require('epson-receipts/domain');
});

angular.module('epsonreceipts.storage').factory('userStorage', function(domain, $http, $q) {
  return {
    create: function(user) {
      return $http.post('/api/users', user);
    }
  };
});

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


angular.module('epsonreceipts.storage').factory('imageStorage', function(domain, uuid, $q, $http) {
  // TODO: Handle error case
  return {
    fetch: function(options, callback) {
      if (options.id) {
        return $http.get('/api/images/' + options.id).then(function(result) {
          return new domain.Image(result.data);
        });
      } else {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      }
    },

    create: function(image) {
      return uuid().then(function(uuid) {
        image = _.extend({ uuid: uuid }, image);
        return $http.post('/api/images', image);
      }).then(function(result) {
        var image = new domain.Image(result.data);
        return image;
      });
    }
  };
});

