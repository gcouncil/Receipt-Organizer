var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').controller('ImageLoaderController', function(
  options,
  $scope,
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

    var promise = self.promise = imageStorage.fetch({ id: imageId });

    promise.then(function(image) {
      return {
        loading: false,
        missing: false,
        image: image,
        error: undefined
      };
    }, function(error) {
      console.log('Hello?');
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
