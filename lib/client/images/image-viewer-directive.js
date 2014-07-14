var angular = require('angular');
var _ = require('lodash');
var $ = require('jquery');
var d3 = require('d3');
var extendedZoom = require('./support/extended-zoom');
var ImagesLoader = require('imagesloaded');

angular.module('epsonreceipts.images').directive('imageViewer', function(
  $q,
  $timeout,
  $interval,
  $sce
) {
  return {
    restrict: 'E',
    scope: {
      image: '@',
      overlay: '='
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

      $scope.$watch('overlay', function(answers) {
        if (viewerPromise) {
          viewerPromise.then(function(viewer) {
            viewer.updateOverlay(answers);
          });
        }
      });

      $scope.$watch('image', function(image_) {
        if (svg) {
          svg.remove();
        }

        var viewer = d3.select($element[0]).append('svg');
        var group = viewer.append('g');
        var image = group.append('image');
        var overlay = group.append('g');

        viewer.style('opacity', 0);

        _.extend($scope, {
          loading: true,
          loaded: false,
          missing: false,
          error: false
        });


        svg = viewer;
        resize();

        var imageSizePromise = image_ ? detectImageSize(image_) : $q.reject();
        var viewerSizePromise = detectViewerSize();

        viewerPromise = $q.all([
          viewerSizePromise,
          imageSizePromise
        ]).then(function(results) {
          var viewerSize = results[0];
          var imageSize = results[1];

          image
            .attr('width', imageSize[0])
            .attr('height', imageSize[1]);

          var zoom = extendedZoom().on('zoom', function() {
            var offset = zoom.translate();
            group
              .attr('transform', 'translate(' + offset[0] + ',' + offset[1] + '), scale(' + zoom.scale() * zoom.baseScale() + ')');
          });

          zoom.size(viewerSize);
          zoom.contentSize(imageSize);
          zoom.reset();

          viewer.call(zoom);

          if (image_) {
            var loader = new ImagesLoader(image);
            loader.on('done', function() { $scope.loading = false; $scope.loaded = true; svg.style('opacity', 1); });
            loader.on('fail', function() { $scope.loading = false; $scope.error = true; });
          } else {
            $scope.loading = false;
            $scope.missing = true;
          }

          image.attr('xlink:href', image_);

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
            updateOverlay: function(answers, selected) {
              var highlights = _.filter(answers, function(answer) { return answer.isLowConfidence(); });
              var selection = overlay.selectAll('g').data(highlights);
              var enter = selection.enter().append('g');
              enter.append('rect');
              enter.append('text');

              selection.exit().remove();

              selection
                .attr('transform', function(d) { return 'translate(' + d.position.x + ',' + d.position.y + ')'; });

              selection.select('rect')
                .attr('width', function(d) { return d.position.w; })
                .attr('height', function(d) { return d.position.h; })
                .attr('fill', 'orange')
                .attr('fill-opacity', 0.5)
                .attr('stroke', 'orange');

              selection.select('text')
                .attr('font-size', 12 / zoom.baseScale())
                .text('');
            },
            zoom: function(amount) {
              zoom.scale(zoom.scale() * amount, true);
              viewer.transition().call(zoom.event);
            }
          };
        });

        viewerPromise.then(function(viewer) {
          viewer.updateOverlay($scope.overlay);
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
