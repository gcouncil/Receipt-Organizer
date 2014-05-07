var angular = require('angular');

angular.module('epsonreceipts.storage').factory('sessionStorage', function(
  domain,
  $http,
  $q,
  currentUser,
  offline
) {
  return {
    login: function(email, password) {
      if (offline.isOffline()) { return; }
      var promise = $http.post('/api/login', {
        username: email,
        password: password
      });

      return promise.then(function(response){
        currentUser.set(response.data);
        return response.data;
      }, function(response) {
        var message = response.status === 401 ? 'Incorrect email or password' : 'Unknown error';
        return $q.reject(new Error(message));
      });
    },

    logout: function() {
      if (offline.isOffline()) { return; }
      currentUser.set(null);
      return $q.when();
    }
  };
});
