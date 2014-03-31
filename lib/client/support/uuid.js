var angular = require('angular');
var uuid = require('uuid');
var _ = require('lodash');

angular.module('epsonreceipts').service('uuid', function($q) {
  var deferred = $q.defer();
  var nodePromise = deferred.promise;

  // TODO: Get from local storage or ask for a new one from the server
  deferred.resolve(_.times(6, _.bindKey(_, 'random', 255)));

  return function() {
    return nodePromise.then(function(node) {
      return uuid.v1({
        node: node
      });
    });
  };
});
