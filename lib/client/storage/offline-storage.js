var angular = require('angular');
var IdbStore = require('./idb-store');

angular.module('epsonreceipts.storage').factory('offlineStorage', function(
  $rootScope,
  $q,
  storageEvents,
  currentUser
) {
  var store;

  $rootScope.$watch(function() {
    return currentUser.get();
  }, function(user) {
    store = user && user.id ? new IdbStore('user:' + user.id) : undefined;
  });

  function forceDigest() {
    setTimeout(function() {
      $rootScope.$digest();
    }, 0);
  }

  var offlineStorage = {
    load: function(collection) {
      if (!store) { return $q.reject(new Error('No user')); }

      var promise = store.load(collection);
      promise.then(forceDigest, forceDigest);

      return promise;
    },

    store: function(collection, id, data) {
      if (!store) { return $q.reject(new Error('No user')); }

      var promise = store.store(collection, id, data);
      promise.then(forceDigest, forceDigest);

      return promise;
    },

    isOffline: function() {
      return storageEvents.state !== 'online';
    }
  };

  return offlineStorage;
});
