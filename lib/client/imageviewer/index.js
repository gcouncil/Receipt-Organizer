var angular = require('angular');
var d3 = require('d3');
var _ = require('lodash');

angular.module('epsonreceipts.imageviewer', []);

angular.module('epsonreceipts.imageviewer').directive('imageViewer', function() {
  return {
    restrict: 'E',
    scope: {
      src: '='
    },
    link: function($scope, $element, $attributes) {
      var padding = 30;

      var imageSize = { width: 0, height: 0 };
      var svgSize = { width: 0, height: 0 };
      var size = { width: 0, height: 0 };
      var offset = { x: 0, y: 0 };

      var zoom = d3.behavior.zoom().scaleExtent([0.5, 10]).on('zoom', zoomed);

      var svg = d3.select($element[0]).append('svg').call(zoom);
      var image = svg.append('image').attr('preserveAspectRatio', 'xMidYMid');

      $scope.$watch('src', function(src) {
        detectImageSize(src, function(err, width, height) {
          imageSize = { width: width, height: height };
          resized();
        });
        image.attr('xlink:href', src);
      });

      svg.on('resize', resized);
      function resized() {
        svgSize = { width: $element.width(), height: $element.height() };

        var scale = { width: svgSize.width / imageSize.width, height: svgSize.height / imageSize.height };
        scale.min = Math.min(scale.width, scale.height);

        size = { width: imageSize.width * scale.min, height: imageSize.height * scale.min };
        offset = { x: (svgSize.width - size.width) / 2, y: (svgSize.height - size.height) / 2 };

        zoom.translate(_.at(offset, ['x', 'y']));
        zoom.size(_.at(svgSize, ['width', 'height']));

        zoomed();
      }

      function limit(value, min, max, buffer) {
        if (value < min + buffer) {
          return min + buffer;
        }
        if (value > max - buffer) {
          return max - buffer;
        }
        return value;
      }

      function zoomed() {
        var t = zoom.translate();
        var s = zoom.scale();

        var x = t[0];
        var y = t[1];
        var width = s * size.width;
        var height = s * size.height;

        x = limit(x, -width, svgSize.width, padding);
        y = limit(y, -height, svgSize.height, padding);

        zoom.translate([x, y]);

        image.attr('x', x).attr('y', y).attr('width', width).attr('height', height);
      }

      function detectImageSize(src, callback) {
        if (!src) { return; }
        var img = new Image();
        img.src = src;

        var $img = angular.element(img);
        $img.bind('load', onLoad);

        function onLoad() {
          $img.unbind('load', onLoad);
          callback(null, img.width, img.height);
        }
      }
    }
  };
});
