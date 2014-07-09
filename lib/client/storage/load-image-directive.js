var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').directive('loadImage', function(
  $sce,
  $q,
  imageStorage
) {
  function LoadImageController(
    $scope,
    $attrs
  ) {
    var self = this;

    $scope.imageLoader = this;

    this.loading = false;
    this.promise = $q.reject();

    $scope.$watch(function() {
      var item = $scope.$eval($attrs.item || 'item');
      return item && item.images && item.images[parseInt($attrs.index, 10) || 0];
    }, function(imageId) {
      self.loading = false;
      $scope[$attrs.image || 'image'] = self.image = null;

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

      $scope[$attrs.image || 'image'] = self.image;

      var promise = self.promise = imageStorage.fetch({ id: imageId }).then(function(blob) {
        return {
          blob: blob,
          url: URL.createObjectURL(blob)
        };
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
        $scope[$attrs.image || 'image'] = self.image;
      });
    });
  }

  return {
    restrict: 'A',
    controller: LoadImageController
  };
});
