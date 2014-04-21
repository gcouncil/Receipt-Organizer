var angular = require('angular');

angular.module('epsonreceipts.storage').factory('imageStorage', function(domain, uuid, $q, $http) {
  var images = {};
  // TODO: Handle error case
  return {
    fetch: function(options, callback) {
      if (options.id) {
        if (options.id in images) {
          return $q.when(images[options.id]);
        } else {
          return $http.get('/api/images/' + options.id, { responseType: 'blob', useQueryAuth: true }).then(function(result) {
            var image = images[options.id] = {
              blob: result.data,
              url: URL.createObjectURL(result.data)
            };

            return $q.when(image);
          });
        }
      } else {
        return $q.reject(new Error('Must supply id to fetch image'));
      }
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
