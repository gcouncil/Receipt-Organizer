var angular = require('angular');

angular.module('epsonreceipts.storage').factory('sessionStorage', function(
  domain,
  $http,
  $q,
  currentUser
) {
  return {
    login: function(email, password) {
      var promise = $http.post('/api/login', {
        username: email,
        password: password
      });

      promise.success(function(data) {
        currentUser.set(data);
      });

      return promise;
    },

    logout: function() {
      currentUser.set(null);
      return $q.when();
    }
  };
});
