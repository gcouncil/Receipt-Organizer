var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('basicStorage', function(
  domain,
  $http,
  $q,
  offline
) {

  var sequence = 0;
  function notify() {
    sequence++;
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function evaluateQuery(options, type, domainModel, callback) {
    return $http.get('/api/' + type).then(function(result) {
      return _.map(result.data, function(data, i) {
        return new domain[domainModel](data);
      });
    });
  }

  // TODO: Handle error case
  var basicStorage = function() {};

  basicStorage.setType = function(type) {
    basicStorage.type = type;
    basicStorage.domainModel = capitalize(type).slice(0, -1);
  };

  basicStorage.query = function(options, callback) {
    if (offline.isOffline()) { return $q.defer([]).promise; }

    // Register callback
    if (options.scope && callback) {
      options.scope.$watch(
        function() { return sequence; },
        function() {
          if (offline.isOffline()) { return $q.defer([]).promise; }
          evaluateQuery(options, basicStorage.type, basicStorage.domainModel).then(callback);
        }
      );
    } else {
      var result = evaluateQuery(options, basicStorage.type, basicStorage.domainModel);
      if (callback) { result.then(callback); }
      return result;
    }
  };

  basicStorage.create = function(model) {
    if (offline.isOffline()) { return; }

    return $http.post('/api/' + basicStorage.type, model).then(function(result) {
      notify();
      var thing = new domain[basicStorage.domainModel](result.data);
      return thing;
    });
  };

  basicStorage.update = function(model) {
    if (offline.isOffline()) { return; }

    $http.put('/api/' + basicStorage.type + '/' + model.id, model).then(function(result) {
      notify();
      return new domain[basicStorage.domainModel](result.data);
    });
  };

  basicStorage.destroy = function(model) {
    if (offline.isOffline()) { return; }

    $http.delete('/api/' + basicStorage.type + '/' + model.id, model).then(function(result) {
      notify();
    });
  };

  return basicStorage;
});

