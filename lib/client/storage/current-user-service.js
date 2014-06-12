var angular = require('angular');

angular.module('epsonreceipts.storage').factory('currentUser', function() {
  var currentUser = window.localStorage.getItem('currentUser') || null;

  if (currentUser) {
    currentUser = JSON.parse(currentUser);
  }

  var service = {
    get: function() {
      return currentUser;
    },

    set: function(user) {
      currentUser = user;
      window.localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  return service;
});
