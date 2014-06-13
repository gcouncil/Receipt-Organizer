var angular = require('angular');

angular.module('epsonreceipts.storage').factory('currentUser', function(
  localStorageService,
  domain
) {
  var currentUser;

  var service = {
    get: function() {
      return currentUser;
    },

    set: function(user) {
      currentUser = new domain.User(user);
      localStorageService.add('currentUser', currentUser.toJSON());
    }
  };

  var cachedUser = localStorageService.get('currentUser');
  if (cachedUser) { service.set(cachedUser); }

  return service;
});
