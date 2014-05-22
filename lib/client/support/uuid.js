var angular = require('angular');
var uuid = require('uuid');

angular.module('epsonreceipts').service('uuid', function($q, $http) {
  var deferred = $q.defer();
  var nodePromise = deferred.promise;

  var node;

  (function() {
    try {
      node = JSON.parse(window.localStorage.getItem('clientId'));

      if (node) {
        return deferred.resolve(node);
      }
    } catch(e) {
      console.warn('Invalid clientId');
    }

    $http.post('/api/clients', {}).success(function(response) {
      node = response;
      window.localStorage.setItem('clientId', JSON.stringify(response));
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

