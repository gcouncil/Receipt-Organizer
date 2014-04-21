var angular = require('angular');

angular.module('epsonreceipts.storage').factory('sessionStorage', function(
  domain,
  notify,
  $state,
  $http,
  $q
) {
  var currentUser;

  return {
    login: function(email, password) {
      return $http.post('/api/login', {
        username: email,
        password: password
      })
      .success(function(data, status, headers, config) {
        currentUser = data;
        notify.success('Successfully logged in');
        $state.go('receipts.thumbnails');
        return data;
      })
      .error(function(data, status, headers, config) {
        var message = status === 401 ? 'Incorrect email or password' : 'Unknown error';
        notify.error(data.message || message);
        return $q.reject(data);
      });
    },

    logout: function() {
      currentUser = undefined;
      notify.success('Successfully logged out');
      $state.go('login');
    }
  };
});
