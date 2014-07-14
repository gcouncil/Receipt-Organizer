var angular = require('angular');
var url = require('url');

angular.module('epsonreceipts.storage').factory('imageStorage', function(
  currentUser,
  domain,
  uuid,
  $q,
  $http
) {
  // TODO: Handle error case
  return {
    fetch: function(options, callback) {
      if (options.id) {
        return $http.get('/api/images/' + options.id, {
          responseType: 'blob',
          skipAuthorization: true
        }).then(function(result) {
          return result.data;
        });
      } else {
        return $q.reject(new Error('Must supply id to fetch image'));
      }
    },

    imgSrc: function(id, callback) {
      return id && url.format({ pathname: '/api/images/' + id, query: { 'access_token': currentUser.get().token } });
    },

    create: function(image) {
      return uuid().then(function(id) {
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
