var angular = require('angular');

angular.module('epsonreceipts.storage').factory('userStorage', function(
  domain,
  $http,
  $q,
  offline
) {
  return {
    create: function(user) {
      if (offline.isOffline()) { return; }
      return $http.post('/api/users', user)
      .then(function(response) {
        return new domain.User(response.data);
      });
    }
  };
});
