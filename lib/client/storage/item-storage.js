var _ = require('lodash');
var angular = require('angular');
var moment = require('moment');

angular.module('epsonreceipts.storage').factory('itemStorage', function(domain, storageEvents, $http, $q) {
  var promise = $q.when({});
  var items = [];

  function ItemQuery($scope, callback) {
    var sort = function(item) {
      return -moment.utc(item.date || item.createdAt).toDate();
    };
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

  storageEvents.on('message', function(event) {
    if (event.data.type !== 'items') { return; }

    if (event.data.action === 'destroyed') {
      updateCache(function(items) {
        delete items[event.data.id];
      });
      return;
    }

    if (event.data.action === 'created' || event.data.action === 'updated') {
      reload(event.data.id);
    }
  });

  function reload(id) {
    return $http.get('/api/items/' + id).then(function(result) {
      var item = domain.Item.load(result.data);
      updateCache(function(items) {
        items[item.id] = item;
      });
      return item;
    });
  }

  // TODO: Handle error case
  var itemStorage = {
    load: function() {
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
      return promise.then(function(items) {
        return items[item];
      });
    },

    watch: function($scope, callback) {
      itemStorage.load();
      return new ItemQuery($scope, callback);
    },

    notify: function($scope, callback) {
      $scope.$watch(function() {
        return items;
      }, function() {
        callback();
      });
    },

    create: function(item) {
      return $http.post('/api/items', item).then(function(result) {
        var item = domain.Item.load(result.data);
        updateCache(function(items) {
          items[item.id] = item;
        });
        return item;
      });
    },

    update: function(item) {
      return $http.put('/api/items/' + item.id, item).then(function(result) {
        var item = domain.Item.load(result.data);
        updateCache(function(items) {
          items[item.id] = item;
        });
        return item;
      });
    },

    persist: function(item) {
      return promise.then(function(items) {
        if (item.id in items) {
          return itemStorage.update(item);
        } else {
          return itemStorage.create(item);
        }
      });
    },

    destroy: function(item) {
      return $http.delete('/api/items/' + item.id).then(function(result) {
        updateCache(function(items) {
          delete items[item.id];
        });
      });
    },

    fetchChildren: function(receipt) {
      return $q.when(_.filter(items, function(item) {
        return item.type === 'expense' && item.receipt === receipt;
      }));
    },

    countByFolder: function() {
      return _.transform(items, function(result, item) {
        _.each(item.folders, function(folder) {
          result[folder] = (result[folder] || 0) + 1;
        });
      }, {});
    },

    markReviewed: function(item) {
      return $http.put('/api/items/' + item.id, { reviewed: true }).then(function(result) {
        var item = domain.Item.load(result.data);
        updateCache(function(items) {
          items[item.id] = item;
        });
        return item;
      });
    },
  };

  return itemStorage;
});

