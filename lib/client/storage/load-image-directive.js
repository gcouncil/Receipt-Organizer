var angular = require('angular');
var _ = require('lodash');
var ImagesLoaded = require('imagesloaded');

angular.module('epsonreceipts.storage').directive('loadImage', function(
  $sce,
  $q,
  imageStorage
) {
  function LoadImageController(
    $scope,
    $element,
    $attrs
  ) {
    var self = this;

    $scope[$attrs.loadImageName || 'imageLoader'] = this;

    this.loading = false;

    function update() {
      if (!$attrs.src) {
        _.extend(self, {
          missing: true,
          loaded: false,
          loading: false,
          error: false
        });
      } else {
        _.extend(self, {
          missing: false,
          loaded: self.loadingImage.isLoaded === true,
          loading: self.loadingImage.isLoaded === undefined,
          error: self.loadingImage.isLoaded === false
        });
      }

      $element.toggleClass('ng-hide', !self.loaded);
    }

    $attrs.$observe('src', function() {
      if (self.imagesLoaded) {
        self.imagesLoaded.off('progress');
      }

      self.imagesLoaded = new ImagesLoaded($element);
      self.loadingImage = self.imagesLoaded.images[0];
      self.imagesLoaded.on('progress', update);
      update();
    });
  }

  return {
    restrict: 'A',
    controller: LoadImageController
  };
});
