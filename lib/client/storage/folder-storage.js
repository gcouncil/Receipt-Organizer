var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('folderStorage', function(
  domain,
  $http,
  $q,
  offlineStorage
) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  // TODO: When online, cache data on load
  // TODO: When offline, load data from cache
  // TODO: When offline, fail on changes

  function evaluateQuery(options, callback) {
    if (offlineStorage.isOffline()) { // FIXME: always indicates offline, thus initial load not working properly when online
      return offlineStorage.load('folders');
    } else {
      return $http.get('/api/folders').then(function(result) {
        return _.map(result.data, function(data, i) {
          return new domain.Folder(data);
        });
      });
    }
  }

  function cacheQueryResults(folders) {
    var promises = folders.map(function(folder) {
      return offlineStorage.store('folders', folder.id, folder);
    });

    return $q.all(promises);
  }

  // TODO: Handle error case
  return {
    query: function(options, callback) {
      // Register callback
      if (options.scope && callback) {
        options.scope.$watch(
          function() { return sequence; },
          function() {
            var result = evaluateQuery(options)
              .then(cacheQueryResults)
              .then(callback);
          }
        );
      } else {
        var result = evaluateQuery(options)
          .then(cacheQueryResults);
        if (callback) { result.then(callback); }
        return result;
      }
    },

    create: function(folder) {
      var promise;

      if (offlineStorage.isOffline()) {
        folder = new domain.Folder(folder);
        promise = offlineStorage.store('folders', folder.id, folder.toJSON());
      } else {
        promise = $http.post('/api/folders', folder)
          .then(function(result) {
            return offlineStorage.store('folders', folder.id, result.data);
          });
      }

      return promise.then(function(folder) {
        notify();
        return new domain.Folder(folder);
      });
    },

    update: function(folder) {
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('folders', folder.id, folder);
      } else {
        promise = $http.put('/api/folders/' + folder.id, folder)
          .then(function(result) {
            return offlineStorage.store('folders', folder.id, result.data);
          });
      }

      return promise.then(function(folder) {
        notify();
        return new domain.Folder(folder);
      });
    },

    destroy: function(folder) {
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('folders', folder.id, undefined);
      } else {
        promise = $http.delete('/api/folders/' + folder.id, folder)
          .then(function(result) {
            return offlineStorage.store('folders', folder.id, undefined);
          });
      }

      return promise.then(function() {
        notify();
      });
    }
  };
});


