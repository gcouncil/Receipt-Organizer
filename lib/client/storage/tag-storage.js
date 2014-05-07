var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('tagStorage', function(domain, $http, $q) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    return $http.get('/api/tags').then(function(result) {
      console.log('result', result);
      return _.map(result.data, function(data, i) {
        return new domain.Tag(data);
      });
    });
  }

  // TODO: Handle error case
  return {
    query: function(options, callback) {
      // Register callback
      if (options.scope && callback) {
        options.scope.$watch(
          function() { return sequence; },
          function() {
            evaluateQuery(options).then(callback);
          }
        );
      } else {
        var result = evaluateQuery(options);
        if (callback) { result.then(callback); }
        return result;
      }
    },

    create: function(tag) {
      $http.post('/api/tags', tag).then(function(result) {
        notify();
      });
    },

    update: function(tag) {
      $http.put('/api/tags/' + tag.id, tag).then(function(result) {
        notify();
      });
    },

    destroy: function(tag) {
      $http.delete('/api/tags/' + tag.id, tag).then(function(result) {
        notify();
      });
    }
  };
});


