var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('tagStorage', function(
  domain,
  $http,
  $q,
  basicStorage
) {
  var tagStorage = _.create(basicStorage, { constructor: 'tagStorage' });
  tagStorage.setType('tags');

  return tagStorage;
});
