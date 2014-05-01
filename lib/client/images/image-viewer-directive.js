var angular = require('angular');
var _ = require('lodash');
var d3 = require('d3');
var extendedZoom = require('./support/extended-zoom');

angular.module('epsonreceipts.images').directive('imageViewer', function(
  $q,
  $timeout,
  $interval,
  $sce
) {
  return {
    restrict: 'E',
    scope: {
      imageLoader: '='
    },
    template: require('./image-viewer-template.html'),
    link: function($scope, $element, $attributes) {
      var svg, viewerPromise;
      var size = { width: 0, height: 0 };
      var resize = function() {
        if (svg) {
          svg
            .attr('width', size.width)
            .attr('height', size.height);
        }

        if (viewerPromise) {
          viewerPromise.then(function(viewer) {
            viewer.update();
          });
        }
      };

      $scope.zoom = function(factor) {
        viewerPromise.then(function(viewer) {
          viewer.zoom(factor);
        });
      };

      $interval(function() {
        size = {
          width: $element.width(),
          height: $element.height()
        };
      }, 100);
      $scope.$watch(function() { return size.width; }, resize);
      $scope.$watch(function() { return size.height; }, resize);

      $scope.$watch('imageLoader.image', function(image_) {
        if (svg) {
          svg.remove();
        }

        var viewer = d3.select($element[0]).append('svg');
        var image = viewer.append('image');

        svg = viewer;
        resize();

        var imageSizePromise = (_.has(image_, 'url')) ? detectImageSize(image_.url) : $q.reject();
        var viewerSizePromise = detectViewerSize();

        viewerPromise = $q.all([
          viewerSizePromise,
          imageSizePromise
        ]).then(function(results) {
          var viewerSize = results[0];
          var imageSize = results[1];

          var zoom = extendedZoom().on('zoom', function() {
            var offset = zoom.translate();
            var size = zoom.contentSize();
            image
              .attr('x', offset[0])
              .attr('y', offset[1])
              .attr('width', size[0])
              .attr('height', size[1]);
          });

          zoom.size(viewerSize);
          zoom.contentSize(imageSize);
          zoom.reset();

          viewer.call(zoom);
          image.attr('xlink:href', image_.url);

          viewer.call(zoom.event);

          viewer.on('resize', function() {
            zoom.size([
              $element.width(),
              $element.height()
            ]);

            viewer.call(zoom.event);
          });

          return {
            update: function() {
              viewer.call(zoom.event);
            },
            zoom: function(amount) {
              zoom.scale(zoom.scale() * amount, true);
              viewer.transition().call(zoom.event);
            }
          };
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

          deferred.resolve([
            img.width,
            img.height
          ]);
        }

        return deferred.promise;
      }

      function detectViewerSize(svg) {
        var deferred = $q.defer();

        function wait() {
          if ($element.width() > 0 && $element.height() > 0) {
            deferred.resolve([
              $element.width(),
              $element.height()
            ]);
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
