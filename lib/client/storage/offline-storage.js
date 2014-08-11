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
    store = user ? new IdbStore('user:' + user.id) : undefined;
  });

  var offlineStorage = {
    load: function(collection) {
      if (!store) { return $q.reject(new Error('No user')); }

      return store.load(collection);
    },

    store: function(collection, id, data) {
      if (!store) { return $q.reject(new Error('No user')); }

      return store.store(collection, id, data);
    },

    isOffline: function() {
      return storageEvents.state !== 'online';
    }
  };

  return offlineStorage;
});
