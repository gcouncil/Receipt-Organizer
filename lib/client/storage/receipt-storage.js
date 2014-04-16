var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('receiptStorage', function(domain, $http, $q) {
  var promise = $q.when({});
  var items = [];

  function updateCache(fn) {
    promise = promise.then(function(items) {
      var result = fn(items);
      return _.isUndefined(result) ? items : result;
    });
    promise.then(function(values) {
      console.log(values);
      items = _.sortBy(_.values(values), function(item) {
        var sort = -(new Date(item.createdAt));
        console.log(sort);
        return sort;
      });
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

      $scope.$watch(function() {
        return items;
      }, function(items) {
        callback(items, items.length);
      });
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

