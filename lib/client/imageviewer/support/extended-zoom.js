var d3 = require('d3');

function extendedZoom() {
  var self = d3.behavior.zoom();
  var original = {};

  var baseSize = [NaN, NaN];

  var minimumOverlap = 32;
  var padding = 48;

  function limit(value, min, max) {
    if (value < min + minimumOverlap) {
      return min + minimumOverlap;
    }
    if (value > max - minimumOverlap) {
      return max - minimumOverlap;
    }
    return value;
  }

  original.translate = self.translate;
  self.translate = function(offset) {
    if (arguments.length > 0) {
      offset = [
        limit(offset[0], -baseSize[0] * self.scale(), self.size()[0]),
        limit(offset[1], -baseSize[1] * self.scale(), self.size()[1])
      ];
      return original.translate(offset);
    } else {
      return original.translate();
    }
  };

  original.scale = self.scale;
  self.scale = function(scale, centered) {
    if (arguments.length > 0) {
      var extent = self.scaleExtent();
      scale = Math.max(extent[0], Math.min(extent[1], scale));

      if (centered) {
        var size = self.size(); // Viewer Size
        var t = self.translate(); // Current Offset
        var s = self.scale(); // Current Scale

        // Point to keep fixed
        var p = [
          size[0] / 2,
          size[1] / 2
        ];

        // Magic formula to keep p fixed when scaling
        self.translate([
          t[0] - (p[0] - t[0]) * (scale / s - 1),
          t[1] - (p[1] - t[1]) * (scale / s - 1)
        ]);
      }

      return original.scale(scale);
    } else {
      return original.scale();
    }
  };

  self.contentSize = function(contentSize) {
    if (arguments.length === 0) {
      return [
        baseSize[0] * self.scale(),
        baseSize[1] * self.scale()
      ];
    } else {
      var size = self.size();
      var fitXScale = (size[0] - padding) / contentSize[0];
      var fitYScale = (size[1] - padding) / contentSize[1];

      // Select scaling factor such that the entire image will fit in both directions
      var baseScale = Math.min(fitXScale, fitYScale);
      self.scaleExtent([ 0.5, 2 / baseScale ]);

      baseSize = [
        contentSize[0] * baseScale,
        contentSize[1] * baseScale
      ];
    }
  };

  self.reset = function() {
    var size = self.size();

    self.scale(1);
    self.translate([
      (size[0] - baseSize[0]) / 2,
      (size[1] - baseSize[1]) / 2
    ]);
  };

  return self;
}

module.exports = extendedZoom;
