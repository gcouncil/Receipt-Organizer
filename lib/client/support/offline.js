var angular = require('angular');

angular.module('epsonreceipts').config(function($httpProvider) {
  $httpProvider.interceptors.push(function(notify, $q, $injector) {
    return {
      request: function(config) {
        if (!navigator.onLine) {
          notify.error('Sorry, you need to be connected to the internet to do that');
          return config || $q.when(config);
        }
        return config;
      },
      requestError: function() {
        return $q.reject([]);
      },
      responseError: function(response) {
        if (response.status >= 500) {
          notify.error('Sorry, there was a problem connecting to the server. Please try again later.');
        }
        return $q.reject(response);
      }
    };
  });
});
