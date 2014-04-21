var angular = require('angular');

angular.module('epsonreceipts').config(function($httpProvider) {
  $httpProvider.interceptors.push(function(currentUser, $q, $injector) {
    return {
      request: function(config) {
        var user = currentUser.get();
        if (user) {
          if (config.useQueryAuth) {
            config.params = config.params || {};
            /* jshint camelcase: false */
            config.params.access_token = user.token;
          } else {
            config.headers.Authorization = 'Bearer ' + user.token;
          }
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401) {
          currentUser.set(null);
          $injector.get('$state').go('login');
        }
        return $q.reject(response);
      }
    };
  });
});
