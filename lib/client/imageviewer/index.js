var angular = require('angular');
var d3 = require('d3');
var _ = require('lodash');

angular.module('epsonreceipts.imageviewer', []);

function ZoomPan(viewerSize, imageSize) {
  this.imageSize = imageSize;
  this.resize(viewerSize);
}

_.extend(ZoomPan.prototype, {
  minimumOverlap: 30,

  resize: function(viewerSize) {
    this.viewerSize = viewerSize;

    this.calculateScale();
    this.calculateScaleRange();
    this.calculateOffset();
  },

  calculateScale: function() {
    // Find the scaling factors that will fit the image on both axes
    var fitXScale = this.viewerSize.width / this.imageSize.width;
    var fitYScale = this.viewerSize.height / this.imageSize.height;

    // Select scaling factor such that the entire image will fit in both directions
    this.baseScale = Math.min(fitXScale, fitYScale);

    this.baseSize = {
      width: this.imageSize.width * this.baseScale,
      height: this.imageSize.height * this.baseScale
    };
  },

  calculateScaleRange: function() {
    this.scaleRange = [
      0.5,
      2 / this.baseScale
    ];
  },

  calculateOffset: function() {
    this.baseOffset = {
      x: (this.viewerSize.width - this.baseSize.width) / 2,
      y: (this.viewerSize.height - this.baseSize.height) / 2
    };
  },

  update: function(translate, scale) {
    this.currentSize = {
      width: scale * this.baseSize.width,
      height: scale * this.baseSize.height
    };

    this.currentOffset = {
      x: this.limit(translate[0], -this.currentSize.width, this.viewerSize.width),
      y: this.limit(translate[1], -this.currentSize.height, this.viewerSize.height),
    };
  },

  limit: function(value, min, max) {
    if (value < min + this.minimumOverlap) {
      return min + this.minimumOverlap;
    }
    if (value > max - this.minimumOverlap) {
      return max - this.minimumOverlap;
    }
    return value;
  }
});

angular.module('epsonreceipts.imageviewer').directive('imageViewer', function($q, $timeout) {
  return {
    restrict: 'E',
    scope: {
      src: '='
    },
    link: function($scope, $element, $attributes) {
      var svg, cancel;

      $scope.$watch('src', function(src) {
        if (svg) {
          svg.remove();
          svg = null;
        }

        if (cancel) {
          cancel.reject();
          cancel = null;
        }

        var imageSizePromise = detectImageSize(src);
        var viewerSizePromise = detectViewerSize();

        $q.all([
          viewerSizePromise,
          imageSizePromise
        ]).then(function(results) {
          var viewerSize = results[0];
          var imageSize = results[1];

          var zoomPan = new ZoomPan(viewerSize, imageSize);

          var zoom = d3.behavior.zoom().on('zoom', update);
          zoom.scaleExtent(zoomPan.scaleRange);
          zoom.translate(_.at(zoomPan.baseOffset, ['x', 'y']));
          zoom.size(_.at(zoomPan.viewerSize, ['x', 'y']));

          svg = d3.select($element[0]).append('svg').call(zoom);
          var image = svg.append('image').attr('xlink:href', src);

          update();

          svg.on('resize', resized);
          function resized() {
            zoomPan.resize({ width: $element.width(), height: $element.height() });
            zoom.size(_.at(zoomPan.viewerSize, ['width', 'height']));

            update();
          }

          function update() {
            zoomPan.update(zoom.translate(), zoom.scale());

            zoom.translate(_.at(zoomPan.currentOffset, ['x', 'y']));
            image
              .attr('x', zoomPan.currentOffset.x)
              .attr('y', zoomPan.currentOffset.y)
              .attr('width', zoomPan.currentSize.width)
              .attr('height', zoomPan.currentSize.height);
          }
        });
      });

      function detectImageSize(src) {
        var deferred = $q.defer();

        if (!src) {
          deferred.reject();
          return deferred.promise;
        }

        var img = new Image();
        img.src = src;

        var $img = angular.element(img);
        $img.bind('load', onLoad);

        function onLoad() {
          $img.unbind('load', onLoad);

          deferred.resolve({
            width: img.width,
            height: img.height
          });
        }

        return deferred.promise;
      }

      function detectViewerSize(svg) {
        var deferred = $q.defer();

        function wait() {
          if ($element.width() > 0 && $element.height() > 0) {
            deferred.resolve({
              width: $element.width(),
              height: $element.height()
            });
          } else {
            $timeout(wait, 100);
          }
        }
        wait();

        return deferred.promise;
      }
    }
  };
});
