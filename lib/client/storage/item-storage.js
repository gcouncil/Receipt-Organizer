var _ = require('lodash');
var angular = require('angular');
var moment = require('moment');

angular.module('epsonreceipts.storage').factory('itemStorage', function(
  domain,
  storageEvents,
  $http,
  $q,
  folderStorage,
  offlineStorage
) {
  var promise = $q.when({});
  var items = [];
  var loaded = false;

  function ItemQuery($scope, callback) {
    var sort;
    var reverse = false;
    var foldersById = {};

    // TODO: depending on folderStorage here is probably a smell, but was
    // the most straightforward way to solve the problem. We may want to
    // consider finding a better way to do this, such as by denormalizing the
    // data in advance. One solution would be store folder names in the item
    // folder array.
    folderStorage.query({ scope: $scope }, function(folders) {
      foldersById = _.indexBy(folders, 'id');
      refresh();
    });

    this.setSort = function(type, reverse_) {
      if (type === 'date') {
        sort = function(item) {
          if (!item.date) { return null; }
          return moment.utc(item.date).format();
        };
      } else if (type === 'folders') {
        sort = function(item) {
          return _(item.folders).map(function(folderId) {
            var folder = foldersById[folderId];
            return folder && folder.name;
          }).sort().valueOf();
        };
      } else if (type) {
        sort = function(item) {
          return item[type];
        };
      } else {
        sort = function(item) {
          return -moment.utc(item.createdAt).toDate();
        };
      }
      reverse = reverse_ || false;
      refresh();
    };

    this.setSort();

    var filters = {};

    function refresh() {
      var result = items;

      if (!loaded) {
        result = [];
      }

      result = _.reduce(filters, function(items, filter) {
        return _.isFunction(filter) ? _.filter(items, filter) : items;
      }, result);

      result = _.sortBy(result, function(item) {
        var value = sort(item);
        return _.isEmpty(value) && !_.isNumber(value) ? undefined : value;
      });

      if (reverse) {
        result = result.reverse();
      }

      callback(result, result.length, loaded);
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
    sync: function() {
      return offlineStorage.load('items')
        .then(function(items) {
          var deferred = $q.defer();

          function process() {
            if (items.length < 1) {
              deferred.resolve();
              return;
            }

            if (offlineStorage.isOffline()) {
              deferred.reject();
              return;
            }

            var item = items.shift();

            itemStorage.create(item).then(function() {
              return offlineStorage.store('items', item.id, undefined);
            })
            .then(process);
          }

          process();

          return deferred.promise;
        });
    },

    load: function(clear, skip) {
      if (clear) {
        loaded = false;
        this.promise = undefined;
        updateCache(function() {
          return {};
        });
      }

      if (this.promise || skip) {
        return this.promise;
      }

      if (offlineStorage.isOffline()) {
        this.promise = offlineStorage.load('items');
      } else {
        this.promise = $http.get('/api/items').then(function(result) {
          return result.data;
        });
      }

      this.promise = this.promise.then(function(data) {
        var items = _.transform(data, function(result, data) {
          result[data.id] = domain.Item.load(data);
        }, {});

        return items;
      });

      var self = this;
      var promise = this.promise;
      this.promise.then(function(items) {
        if (promise !== self.promise) {
          return; // Avoids race condition - don't update cache if another promise is in progress
        }

        loaded = true;

        updateCache(function() {
          return items;
        });
      });

      return this.promise;
    },

    fetch: function(item) {
      return promise.then(function(items) {
        return items[item];
      });
    },

    watch: function($scope, callback) {
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
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('items', item.id, item.toJSON());
      } else {
        promise = $http.post('/api/items', item).then(function(result) { return result.data; });
      }

      return promise.then(function(data) {
        var item = domain.Item.load(data);
        updateCache(function(items) {
          items[item.id] = item;
        });
        return item;
      });
    },

    update: function(item) {
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('items', item.id, item.toJSON());
      } else {
        promise = $http.put('/api/items/' + item.id, item).then(function(result) {
          return result.data;
        });
      }

      return promise.then(function(data) {
        var item = domain.Item.load(data);
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
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('items', item.id, undefined);
      } else {
        promise = $http.delete('/api/items/' + item.id).then(function(result) {
          return result.data;
        });
      }

      return promise.then(function() {
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
      item.reviewed = true;

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

