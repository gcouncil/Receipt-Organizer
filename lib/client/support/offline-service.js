var angular = require('angular');

angular.module('epsonreceipts').factory('offline', function() {
  var service = {
    isOffline: function() {
      return !navigator.onLine;
    }
  };

  return service;
});
