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
      return $http.post('/api/users', user)
        .then(function(response) {
          return new domain.User(response.data);
        });
    },

    updateSettings: function(user) {
      var promise;

      if (offlineStorage.isOffline()) {
        var deferred = $q.defer();
        promise = deferred.promise;
        deferred.resolve(user.toJSON());
      } else {
        promise = $http.put('/api/users/' + user.id, user.settings).then(function(result) {
          return result.data;
        });
      }

      return promise.then(function(data) {
        return new domain.User(data);
      });
    }
  };
});
