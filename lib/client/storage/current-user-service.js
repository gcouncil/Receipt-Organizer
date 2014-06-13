var angular = require('angular');

angular.module('epsonreceipts.storage').factory('currentUser', function(
  domain
) {
  var currentUser;

  var service = {
    get: function() {
      return currentUser;
    },

    set: function(user) {
      try {
        currentUser = (new domain.User(user)).toJSON();
      } catch(e) {
        currentUser = undefined;
      }
      window.localStorage.setItem('currentUser', currentUser);
    }
  };

  var cachedUser = window.localStorage.getItem('currentUser');
  if (cachedUser) { service.set(cachedUser); }

  return service;
});
