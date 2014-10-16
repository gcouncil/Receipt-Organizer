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
        promise = $http.delete('/api/folders/' + folder.id)
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
      var ctx = this;
      var promises = [];

      if (offlineStorage.isOffline()) {
        return dfd.resolve();
      }

      offlineStorage.load('folders').then(function(localFolders) {
        var destroyFoldersPromises = ctx.syncDestroy();

        $q.all(destroyFoldersPromises).then(function() {
          // Get folders from server
          evaluateQuery().then(function(serverFolders) {
            promises.push(ctx.syncCreate(serverFolders, localFolders));
            promises.push(ctx.syncUpdate(serverFolders, localFolders));

            // TODO: How should "duplicates" be handled?
            // e.g. Have same name folders locally and on server with different ids
            // Should they be merged?  Currently folders with the same name are allowed.

            $q.all(_.flatten(promises)).then(function() {
              dfd.resolve();
            });
          });
        });
      });

      return dfd.promise.then(function() {
        notify();
      });
    },

    syncDestroy: function() {
      // Folder deleted locally - destroy on server
      var ids = unsyncedDestroyedFolderIds();
      var promises = [];
      ids.forEach(function(folderId) {
        promises.push($http.delete('/api/folders/' + folderId));
      });
      $window.localStorage.removeItem('unsyncedDestroyedFolderIds');

      return promises;
    },

    syncCreate: function(serverFolders, localFolders) {
      var serverFolderIds = _.pluck(serverFolders, 'id');
      var localFolderIds = _.pluck(localFolders, 'id');
      var folderIdsOnServerOnly = _.difference(serverFolderIds, localFolderIds);
      var folderIdsOnLocalOnly = _.difference(localFolderIds, serverFolderIds);
      var promises = [];

      // New folders on server - save locally
      folderIdsOnServerOnly.forEach(function(folderId) {
        var folder = _.find(serverFolders, {id: folderId});
        promises.push(offlineStorage.store('folders', folder.id, folder.toJSON()));
      });

      // New folders locally - create on server
      folderIdsOnLocalOnly.forEach(function(folderId) {
        var folder = _.find(localFolders, {id: folderId});
        promises.push($http.post('/api/folders', folder));
      });

      return promises;
    },

    syncUpdate: function(serverFolders, localFolders) {
      // Local folder (also on server) name updated - update folder names on server
      var serverFolderIds = _.pluck(serverFolders, 'id');
      var localFolderIds = _.pluck(localFolders, 'id');
      var folderIdsOnBoth = _.intersection(serverFolderIds, localFolderIds);
      var promises = [];

      folderIdsOnBoth.forEach(function(folderId) {
        var localFolder = _.find(localFolders, {id: folderId});
        var serverFolder = _.find(serverFolders, {id: folderId});
        if (localFolder.name !== serverFolder.name) {
          promises.push($http.put('/api/folders/' + folderId, localFolder));
        }
      });

      return promises;
    }
  };
});


