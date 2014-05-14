var angular = require('angular');
var uuid = require('uuid');

angular.module('epsonreceipts').service('uuid', function($q, $http) {
  var deferred = $q.defer();
  var nodePromise = deferred.promise;

  var node;
  (function() {
    node = window.localStorage.getItem('clientId');

    if (node) {
      return deferred.resolve(node);
    }

    $http.post(
    '/api/clients', {}).success(function(response) {
      node = response;
      window.localStorage.setItem('clientId', response);
      deferred.resolve(node);
    });
  })();

  return function() {
    return nodePromise.then(function(node) {
      var id =  uuid.v1({
        node: node
      });
      return id;
    });
  };
});

