var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('basicStorage', function(
  domain,
  $http,
  $q,
  offline
) {

  this.type = null;
  this.domainModel = capitalize(this.type);

  var sequence = 0;
  function notify() {
    sequence++;
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function evaluateQuery(options, callback) {
    return $http.get('/api/' + this.type).then(function(result) {
      return _.map(result.data, function(data, i) {
        return new domain[this.domainModel](data);
      });
    });
  }

  // TODO: Handle error case
  var basicStorage = {};

  basicStorage.prototype.query = function(options, callback) {
    if (offline.isOffline()) { return $q.defer([]).promise; }
    // Register callback
    if (options.scope && callback) {
      options.scope.$watch(
        function() { return sequence; },
        function() {
          if (offline.isOffline()) { return $q.defer([]).promise; }
          evaluateQuery(options).then(callback);
        }
      );
    } else {
      var result = evaluateQuery(options);
      if (callback) { result.then(callback); }
      return result;
    }
  };

  basicStorage.prototype.create = function(model) {
    if (offline.isOffline()) { return; }
    $http.post('/api/' + this.type, model).then(function(result) {
      notify();
    });
  };

  basicStorage.prototype.update = function(model) {
    if (offline.isOffline()) { return; }
    $http.put('/api/' + this.type + '/' + model.id, model).then(function(result) {
      notify();
    });
  };

  basicStorage.prototype.destroy = function(model) {
    if (offline.isOffline()) { return; }
    $http.delete('/api/' + this.type + '/' + model.id, model).then(function(result) {
      notify();
    });
  };

  return basicStorage;
});

