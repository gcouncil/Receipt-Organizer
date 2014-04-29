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

      return promise.success(function(data, status, headers, config){
        currentUser.set(data);
        return data;
      })
      .error(function(data, status, headers, config) {
        var message = status === 401 ? 'Incorrect email or password' : 'Unknown error';
        return $q.reject(new Error(message));
      });
    },

    logout: function() {
      currentUser.set(null);
      return $q.when();
    }
  };
});
