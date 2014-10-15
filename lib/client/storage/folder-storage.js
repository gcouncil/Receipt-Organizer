var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('folderStorage', function(
  domain,
  $http,
  $q,
  $window,
  offlineStorage
) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery() {
    if (offlineStorage.isOffline()) {
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

  function unsyncedDestroyedFolderIds() {
    var ids = $window.localStorage.getItem('unsyncedDestroyedFolderIds');
    return ids ? ids.split(',') : [];
  }

  // TODO: Handle error case
  return {
    query: function(options, callback) {
      // Register callback
      if (options.scope && callback) {
        options.scope.$watch(
          function() { return sequence; },
          function() {
            evaluateQuery()
              .then(cacheQueryResults)
              .then(callback);
          }
        );

      } else {
        var result = evaluateQuery()
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
        promise = offlineStorage.store('folders', folder.id, undefined)
          .then(function() {
            var ids = unsyncedDestroyedFolderIds();
            ids.push(folder.id);
            $window.localStorage.setItem('unsyncedDestroyedFolderIds', ids);
          });
      } else {
        promise = $http.delete('/api/folders/' + folder.id, folder)
          .then(function(result) {
            return offlineStorage.store('folders', folder.id, undefined);
          });
      }

      return promise.then(function() {
        notify();
      });
    },

    sync: function() {
      var dfd = $q.defer();

      if (offlineStorage.isOffline()) {
        return dfd.resolve();
      }

      // Get folders from the server
      evaluateQuery().then(function(results) {
        var promises = [];
        var serverFolders = results;

        offlineStorage.load('folders').then(function(results) {
          var localFolders = results;

          // Case NEW folders ON SERVER
          var serverFolderIds = _.pluck(serverFolders, 'id');
          var localFolderIds = _.pluck(localFolders, 'id');
          var folderIdsOnServerOnly = _.difference(serverFolderIds, localFolderIds);
          // Save server-only folders into indexdb
          folderIdsOnServerOnly.forEach(function(folderId) {
            var folder = _.find(serverFolders, {id: folderId});
            promises.push(offlineStorage.store('folders', folder.id, folder.toJSON()));
          });

          // Case update existing folder ids on server with different local names
          // Update server folders to use LOCAL names
          var folderIdsOnBoth = _.intersection(serverFolderIds, localFolderIds);
          folderIdsOnBoth.forEach(function(folderId) {
            var localFolder = _.find(localFolders, {id: folderId});
            var serverFolder = _.find(serverFolders, {id: folderId});
            if (localFolder.name !== serverFolder.name) {
              promises.push($http.put('/api/folders/' + folderId, localFolder));
            }
          });

          // Case NEW FOLDERS locally
          // Post local folders to server
          var folderIdsOnLocalOnly = _.difference(localFolderIds, serverFolderIds);
          folderIdsOnLocalOnly.forEach(function(folderId) {
            var folder = _.find(localFolders, {id: folderId});
            promises.push($http.post('/api/folders', folder));
          });

          // Case folder deleted locally
          // Destroy folder on server
          var ids = unsyncedDestroyedFolderIds();
          ids.forEach(function(folderId) {
            promises.push($http.delete('/api/folders/' + folderId));
          });
          $window.localStorage.removeItem('unsyncedDestroyedFolderIds');

          // TODO: case SAME NAME FOLDERS locally and on server with DIFFERENT IDs
          // merge folders?

          $q.all(promises).then(function() {
            dfd.resolve();
          });
        });

        return dfd.promise.then(function() {
          notify();
        });
      });
    }
  };
});


