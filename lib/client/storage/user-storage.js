var angular = require('angular');

angular.module('epsonreceipts.storage').factory('userStorage', function(domain, $http, $q) {
  return {
    create: function(user) {
      return $http.post('/api/users', user)
      .then(function(response) {
        return new domain.User(response.data);
      });
    },

    updateSettings: function(user) {
      return $http.put('/api/users', user)
      .then(function(response) {
        return new domain.User(response.data);
      });
    }
  };
});
