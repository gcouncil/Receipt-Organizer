var angular = require('angular');
var _ = require('lodash');



angular.module('epsonreceipts.storage').factory('receiptStorage', function(domain, $http, $q) {
  var promise = $q.when({});
  var items = [];

  function ReceiptQuery($scope, callback) {
    var sort = function(item) { return -(new Date(item.createdAt)); };
    var filters = {};

    function refresh() {
      var result = items;

      result = _.reduce(filters, function(items, filter) {
        return _.isFunction(filter) ? _.filter(items, filter) : items;
      }, result);

      result = _.sortBy(result, sort);

      callback(result, result.length);
    }

    this.setFilter = function(name, fn) {
      filters[name] = fn;
      refresh();
    };

    $scope.$watch(function() {
      return items;
    }, function(items) {
      refresh();
    });
  }

  function updateCache(fn) {
    promise = promise.then(function(items) {
      var result = fn(items);
      return _.isUndefined(result) ? items : result;
    });
    promise.then(function(values) {
      items = _.values(values);
    });
  }

  // TODO: Handle error case
  var receiptStorage = {
    load: function() {
      return $http.get('/api/receipts').then(function(result) {
        var receipts = _.transform(result.data, function(result, data) {
          result[data.id] = new domain.Receipt(data);
        }, {});

        updateCache(function() {
          return receipts;
        });
      });
    },

    watch: function($scope, callback) {
      receiptStorage.load();
      return new ReceiptQuery($scope, callback);
    },

    create: function(receipt) {
      $http.post('/api/receipts', receipt).then(function(result) {
        var receipt = new domain.Receipt(result.data);
        updateCache(function(items) {
          items[receipt.id] = receipt;
        });
        return receipt;
      });
    },

    update: function(receipt) {
      $http.put('/api/receipts/' + receipt.id, receipt).then(function(result) {
        var receipt = new domain.Receipt(result.data);
        updateCache(function(items) {
          items[receipt.id] = receipt;
        });
        return receipt;
      });
    },

    persist: function(receipt) {
      return promise.then(function(receipts) {
        if (receipt.id in receipts) {
          return receiptStorage.update(receipt);
        } else {
          return receiptStorage.create(receipt);
        }
      });
    },

    destroy: function(receipt) {
      $http.delete('/api/receipts/' + receipt.id).then(function(result) {
        updateCache(function(items) {
          delete items[receipt.id];
        });
      });
    }
  };

  return receiptStorage;
});

