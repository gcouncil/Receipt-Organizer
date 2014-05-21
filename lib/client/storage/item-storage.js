var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('itemStorage', function(domain, $http, $q, offline) {
  var promise = $q.when({});
  var items = [];

  function ItemQuery($scope, callback) {
    var sort = function(item) { return -new Date(item.date); };
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
  var itemStorage = {
    load: function() {
      if (offline.isOffline()) { return []; }
      return $http.get('/api/items').then(function(result) {
        var items = _.transform(result.data, function(result, data) {
          result[data.id] = domain.Item.load(data);
        }, {});

        updateCache(function() {
          return items;
        });
      });
    },

    fetch: function(item) {
      if (offline.isOffline()) { return; }
      return promise.then(function(items) {
        return items[item];
      });
    },

    watch: function($scope, callback) {
      itemStorage.load();
      return new ItemQuery($scope, callback);
    },

    create: function(item) {
      if (offline.isOffline()) { return; }
      return $http.post('/api/items', item).then(function(result) {
        var item = domain.Item.load(result.data);
        updateCache(function(items) {
          items[item.id] = item;
        });
        return item;
      });
    },

    update: function(item) {
      if (offline.isOffline()) { return; }
      return $http.put('/api/items/' + item.id, item).then(function(result) {
        var item = domain.Item.load(result.data);
        updateCache(function(items) {
          items[item.id] = item;
        });
        return item;
      });
    },

    persist: function(item) {
      if (offline.isOffline()) { return; }
      return promise.then(function(items) {
        if (item.id in items) {
          return itemStorage.update(item);
        } else {
          return itemStorage.create(item);
        }
      });
    },

    destroy: function(item) {
      if (offline.isOffline()) { return; }
      return $http.delete('/api/items/' + item.id).then(function(result) {
        updateCache(function(items) {
          delete items[item.id];
        });
      });
    },

    fetchChildren: function(receipt) {
      if (offline.isOffline()) { return; }
      return $q.when(_.filter(items, function(item) {
        return item.type === 'expense' && item.receipt === receipt;
      }));
    },

    recognize: function(receipt) {
      if (offline.isOffline()) { return; }
      return $http.post('/api/items/' + receipt + '/recognize').then(function(result) {
        var item = domain.Item.load(result.data);
        updateCache(function(items) {
          items[item.id] = item;
        });
        return item;
      });
    }
  };

  return itemStorage;
});

