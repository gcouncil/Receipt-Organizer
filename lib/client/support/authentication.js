var angular = require('angular');

angular.module('epsonreceipts').service('authentication', function(localStorageService) {
  var user = localStorageService.get('currentUser') || null;
  return {
    user: user,
    setUser: function(user) {
      this.user = user;
      localStorageService.add('currentUser', user);
    },
    clearUser: function() {
      this.user = null;
      localStorageService.remove('currentUser');
    }
  };
});

angular.module('epsonreceipts').config(function($httpProvider) {
  $httpProvider.interceptors.push(function(authentication, $q, $injector) {
    return {
      request: function(config) {
        var user = authentication.user;
        if (user) {
          config.headers.Authorization = 'Basic ' + btoa(user.email + ':' + user.token);
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401) {
          authentication.setUser(undefined);
          $injector.get('$state').go('login');
        }
        return $q.reject(response);
      }
    };
  });
});
