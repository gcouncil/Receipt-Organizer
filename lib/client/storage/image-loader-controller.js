var angular = require('angular');

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
    if (!imageId) {
      self.loading = false;
      $scope[options.image] = self.image = false;
      return;
    }

    $scope[options.image] = self.image = true;
    self.loading = true;
    var promise = self.promise = imageStorage.fetch({ id: imageId });

    promise.then(function(image) {
      if (promise !== self.promise) { return; }

      $scope[options.image] = self.image = image;
      self.loading = false;
    });
  });
});
