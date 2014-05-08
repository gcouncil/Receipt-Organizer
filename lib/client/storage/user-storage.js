var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('userStorage', function(
  domain,
  $http,
  $q,
  basicStorage
) {
  var userStorage = _.create(basicStorage, { constructor: 'userStorage' });
  userStorage.setType('users');

  return userStorage;
});
