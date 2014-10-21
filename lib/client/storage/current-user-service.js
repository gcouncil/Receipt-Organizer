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
      currentUser = new domain.User(user);
      window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
    },

    isAuthenticated: function() {
      var user = this.get();
      return user && user.token ? true : false;
    }
  };

  try {
    var cachedUserString = window.localStorage.getItem('currentUser');
    if (cachedUserString) {
      var cachedUserData = JSON.parse(cachedUserString);
      service.set(cachedUserData);
    }
  } catch(e) {
    console.warn('Unable to parse user from local storage');
  }

  return service;
});
