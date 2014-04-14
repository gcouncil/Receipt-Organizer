var angular = require('angular');
var d3 = require('d3');
var extendedZoom = require('./support/extended-zoom');

angular.module('epsonreceipts.imageviewer').directive('imageViewer', function($q, $timeout) {
  return {
    restrict: 'E',
    scope: {
      src: '='
    },
    template: require('./image-viewer.html'),
    link: function($scope, $element, $attributes) {
      var svg, viewerPromise;

      $scope.zoom = function(factor) {
        viewerPromise.then(function(viewer) {
          viewer.zoom(factor);
        });
      };

      $scope.$watch('src', function(src) {
        if (svg) {
          svg.remove();
        }

        var viewer = d3.select($element[0]).append('svg');
        var image = viewer.append('image');

        svg = viewer;

        var imageSizePromise = detectImageSize(src);
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
          image.attr('xlink:href', src);

          viewer.call(zoom.event);

          viewer.on('resize', function() {
            zoom.size([
              $element.width(),
              $element.height()
            ]);

            viewer.call(zoom.event);
          });

          return {
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
