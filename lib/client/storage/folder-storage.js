var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('folderStorage', function(domain, $http, $q, offline) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    return $http.get('/api/folders').then(function(result) {
      return _.map(result.data, function(data, i) {
        return new domain.Folder(data);
      });
    });
  }

  // TODO: Handle error case
  return {
    query: function(options, callback) {
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
    },

    create: function(folder) {
      if (offline.isOffline()) { return; }
      $http.post('/api/folders', folder).then(function(result) {
        notify();
      });
    },

    update: function(folder) {
      if (offline.isOffline()) { return; }
      $http.put('/api/folders/' + folder.id, folder).then(function(result) {
        notify();
      });
    },

    destroy: function(folder) {
      if (offline.isOffline()) { return; }
      $http.delete('/api/folders/' + folder.id, folder).then(function(result) {
        notify();
      });
    }
  };
});


