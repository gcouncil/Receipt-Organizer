var angular = require('angular');

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
