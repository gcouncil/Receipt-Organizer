var _ = require('lodash');
var angular = require('angular');
var base64 = require('base64-js');
var url = require('url');

angular.module('epsonreceipts.storage').factory('imageStorage', function(
  currentUser,
  domain,
  offlineStorage,
  uuid,
  $q,
  $http
) {
  var cache = {};

  // TODO: Handle error case
  var imageStorage = {
    sync: function() {
      if (offlineStorage.isOffline()) { return; }

      return offlineStorage.load('images')
      .then(function(images) {
        var deferred = $q.defer();

        function process() {
          if (images.length < 1) { return deferred.resolve(); }

          var imageRecord = images.shift();
          var imageData = base64.toByteArray(imageRecord.imageData);

          $http.put('/api/images/' + imageRecord.id, new Blob([imageData], { type: imageRecord.imageType }), {
            headers: { 'Content-Type': imageRecord.imageType }
          })
          .then(function(result) {
            delete cache[imageRecord.id];
            return offlineStorage.store('images', imageRecord.id, undefined);
          })
          .then(process, function(err) {
            deferred.reject(err);
          });
        }

        process();

        return deferred.promise;
      });
    },

    load: function() {
      cache = {};

      if (offlineStorage.isOffline()) {
        offlineStorage.load('images')
          .then(function(images) {
            _.transform(images, function(memo, image) {
              memo[image.id] = { data: image.imageData, type: image.imageType };
            }, cache);
          });
      }
    },

    fetch: function(options, callback) {
      var promise;

      if (!options.id) {
        return $q.reject(new Error('Must supply id to fetch image'));
      }

      if (offlineStorage.isOffline()) {
        var deferred = $q.defer();
        promise = deferred.promise;
        var image = cache[options.id];

        if (!image) {
          deferred.reject(new Error('Image not found in cache'));
        } else {
          var bytes = base64.toByteArray(image.data);
          var blob = new Blob([bytes], { type: image.type });
          deferred.resolve(blob);
        }
      }
      else {
        promise = $http.get(imageStorage.imgSrc(options.id), {
          responseType: 'blob',
          skipAuthorization: true
        }).then(function(result) {
          return result.data;
        });
      }

      return promise;
    },

    imgSrc: function(id) {
      if (offlineStorage.isOffline()) {
        return 'data:' + cache[id].type + ';base64,' + cache[id].data;
      } else {
        return id && url.format({ pathname: '/api/images/' + id, query: { 'access_token': currentUser.get().token } });
      }
    },

    create: function(image) {
      return uuid().then(function(id) {
        var promise;

        if (offlineStorage.isOffline()) {
          var deferred = $q.defer();

          var reader = new FileReader();

          reader.onload = function() {
            var bytes = new Uint8Array(reader.result);
            var data = base64.fromByteArray(bytes);

            deferred.resolve(data);
          };

          reader.onerror = function() {
            deferred.reject(reader.error);
          };

          reader.readAsArrayBuffer(image);

          promise = deferred.promise.then(function(data) {
            cache[id] = { data: data, type: image.type };
            return offlineStorage.store('images', id, { id: id, imageData: data, imageType: image.type });
          })
          .then(function() {
            return { id: id };
          });
        } else {
          promise = $http.put('/api/images/' + id, image, {
            headers: { 'Content-Type': image.type }
          })
          .then(function(result) {
            return result.data;
          });
        }

        return promise;
      });
    }
  };

  return imageStorage;
});
