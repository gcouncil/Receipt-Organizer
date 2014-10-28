var angular = require('angular');

angular.module('epsonreceipts.storage').factory('userStorage', function(
  domain,
  $http,
  $q,
  currentUser,
  offlineStorage
) {
  return {
    sync: function() {
      var user = currentUser.get();
      return this.updateSettings(user);
    },

    create: function(user) {
      return $http.post('/api/users', user).then(function(result) {
        return new domain.User(result.data);
      });
    },

    update: function(user) {
      return $http.put('/api/users/' + user.id, user).then(function(result) {
        return new domain.User(result.data);
      });
    },

    updateSettings: function(user) {
      var promise;

      if (offlineStorage.isOffline()) {
        var deferred = $q.defer();
        promise = deferred.promise;
        deferred.resolve(user.toJSON());
      } else {
        promise = $http.put('/api/users/' + user.id + '/settings', user.settings).then(function(result) {
          return result.data;
        });
      }

      return promise.then(function(data) {
        return new domain.User(data);
      });
    }
  };
});
