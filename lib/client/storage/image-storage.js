var angular = require('angular');

angular.module('epsonreceipts.storage').factory('imageStorage', function(
  domain,
  uuid,
  $q,
  $http,
  offline
) {
  var images = {};
  // TODO: Handle error case
  return {
    fetch: function(options, callback) {
      if (offline.isOffline()) { return; }
      if (options.id) {
        if (options.id in images) {
          return $q.when(images[options.id]);
        } else {
          return $http.get('/api/images/' + options.id).then(function(result) {
            return $http.get(result.data.url, { responseType: 'blob', skipAuthorization: true });
          }).then(function(result) {
            var image = images[options.id] = result.data;

            return $q.when(image);
          });
        }
      } else {
        return $q.reject(new Error('Must supply id to fetch image'));
      }
    },

    create: function(image) {
      if (offline.isOffline()) { return $q.defer().promise; }
      return uuid().then(function(id) {
        images[id] = image;

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
