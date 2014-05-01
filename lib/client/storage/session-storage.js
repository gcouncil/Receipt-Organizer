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

      return promise.then(function(response){
        currentUser.set(response.data);
        return response.data;
      }, function(response) {
        var message = response.status === 401 ? 'Incorrect email or password' : 'Unknown error';
        return $q.reject(new Error(message));
      });
    },

    logout: function() {
      currentUser.set(null);
      return $q.when();
    }
  };
});
