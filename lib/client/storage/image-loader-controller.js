var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').controller('ImageLoaderController', function(
  options,
  $scope,
  $sce,
  $q,
  imageStorage
) {
  var self = this;
  this.loading = false;
  this.promise = $q.reject();

  $scope.$watch(options.receipt + '.image', function(imageId) {
    self.loading = false;
    $scope[options.image] = self.image = null;

    if (imageId) {
      _.extend(self, {
        loading: true,
        missing: false,
        error: undefined,
        image: undefined
      });
    } else {
      _.extend(self, {
        loading: false,
        missing: true,
        error: undefined,
        image: undefined
      });
      return;
    }

    $scope[options.image] = self.image;

    var promise = self.promise = imageStorage.fetch({ id: imageId }).then(function(blob) {
      var deferred = $q.defer();
      var reader = new FileReader();

      reader.onerror = function() {
        deferred.reject(reader.error);
      };

      reader.onload = function() {
        deferred.resolve({
          blob: blob,
          url: $sce.trustAs($sce.RESOURCE_URL, reader.result)
        });
      };

      reader.readAsDataURL(blob);

      return deferred.promise;
    });

    promise.then(function(image) {
      return {
        loading: false,
        missing: false,
        image: image,
        error: undefined
      };
    }, function(error) {
      return {
        loading: false,
        missing: false,
        image: undefined,
        error: error
      };
    }).then(function(result) {
      if (promise !== self.promise) { return; }
      _.extend(self, result);
      $scope[options.image] = self.image;
    });
  });
});
