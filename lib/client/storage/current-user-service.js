var angular = require('angular');

angular.module('epsonreceipts.storage').factory('currentUser', function(
  localStorageService
) {
  var currentUser = localStorageService.get('currentUser') || null;

  var service = {
    get: function() {
      return currentUser;
    },

    set: function(user) {
      currentUser = user;
      localStorageService.add('currentUser', user);
    }
  };

  return service;
});
