var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage', []);

angular.module('epsonreceipts.storage').factory('domain', function() {
  return require('epson-receipts/domain');
});

angular.module('epsonreceipts.storage').factory('userStorage', function(domain, $http, $q) {
  return {
    create: function(user) {
      return $http.post('/api/users', user)
      .then(function(response) {
        return new domain.User(response.data);
      });
    }
  };
});

angular.module('epsonreceipts.storage').factory('receiptStorage', function(domain, $http, $q) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    return $http.get('/api/receipts').then(function(result) {
      return _.map(result.data, function(data, i) {
        return new domain.Receipt(data);
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

    create: function(receipt) {
      $http.post('/api/receipts', receipt).then(function(result) {
        notify();
      });
    },

    update: function(receipt) {
      $http.put('/api/receipts/' + receipt.id, receipt).then(function(result) {
        notify();
      });
    },

    destroy: function(receipt) {
      $http.delete('/api/receipts/' + receipt.id).then(function(result) {
        notify();
      });
    }
  };
});


angular.module('epsonreceipts.storage').factory('imageStorage', function(domain, uuid, $q, $http, authentication) {
  var images = {};
  // TODO: Handle error case
  return {
    fetch: function(options, callback) {
      var deferred = $q.defer();
      if (options.id) {
        if (options.id in images) {
          deferred.resolve(images[options.id]);
        } else {
          $http.get('/api/images/' + options.id, { responseType: 'blob', useQueryAuth: true }).then(function(result) {
            var image = images[options.id] = {
              blob: result.data,
              url: URL.createObjectURL(result.data)
            };

            deferred.resolve(image);
          }, function(error) {
            deferred.reject(error);
          });
        }
      } else {
        deferred.reject(new Error('Must supply id to fetch image'));
      }

      return deferred.promise;
    },

    create: function(image) {
      return uuid().then(function(id) {
        images[id] = {
          blob: image,
          url: URL.createObjectURL(image)
        };

        return $http.put('/api/images/' + id, image, {
          headers: { 'Content-Type': image.type }
        });
      }).then(function(result) {
        var image = new domain.Image(result.data);
        return image;
      });
    }
  };
});

angular.module('epsonreceipts.storage').factory('tagStorage', function(domain, $http, $q) {
  var sequence = 0;
  function notify() {
    sequence++;
  }

  function evaluateQuery(options, callback) {
    return $http.get('/api/tags').then(function(result) {
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

