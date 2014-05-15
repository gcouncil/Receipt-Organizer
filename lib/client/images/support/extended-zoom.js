var _ = require('lodash');
var d3 = require('d3');

function extendedZoom(options) {

  options = options || {};
  var overlap = _.isFinite(options.overlap) ? options.overlap : 20;
  var padding = _.isFinite(options.padding) ? options.padding : 20;

  var self = d3.behavior.zoom();
  var original = {};

  var baseSize = [NaN, NaN];
  var baseScale = 1;

  function limit(value, min, max) {
    if (value < min + overlap) {
      return min + overlap;
    }
    if (value > max - overlap) {
      return max -overlap;
    }
    return value;
  }

  original.event = self.event;
  self.event = function() {
    self.scale(self.scale());
    self.translate(self.translate());

    return original.event.apply(this, arguments);
  };

  function limitTranslate(offset) {
    var size = self.size();
    var scale = self.scale();

    offset = [
      limit(offset[0], -baseSize[0] * scale, size[0]),
      limit(offset[1], -baseSize[1] * scale, size[1])
    ];

    return offset;
  }

  original.translate = self.translate;
  self.translate = function(offset) {
    if (arguments.length > 0) {
      offset = limitTranslate(offset);
      return original.translate(offset);
    } else {
      offset = original.translate();
      return limitTranslate(offset);
    }
  };

  function limitScale(scale) {
    var extent = self.scaleExtent();
    return Math.max(extent[0], Math.min(extent[1], scale));
  }

  original.scale = self.scale;
  self.scale = function(scale, centered) {
    if (arguments.length > 0) {
      scale = limitScale(scale);

      if (centered) {
        var size = self.size(); // Viewer Size
        var t = self.translate(); // Current Offset
        var s = self.scale(); // Current Scale


        // Point to keep fixed
        var p = [
          size[0] / 2,
          size[1] / 2
        ];

        // Update scale, so that translate doesn't get incorrectly adjusted
        original.scale(scale);
        // Magic formula to keep p fixed when scaling
        self.translate([
          t[0] - (p[0] - t[0]) * (scale / s - 1),
          t[1] - (p[1] - t[1]) * (scale / s - 1)
        ]);
      }

      return original.scale(scale);
    } else {
      scale = original.scale();
      return limitScale(scale);
    }
  };

  self.baseScale = function() {
    return baseScale;
  };

  self.contentSize = function(contentSize) {
    if (arguments.length === 0) {
      return [
        baseSize[0] * self.scale(),
        baseSize[1] * self.scale()
      ];
    } else {
      var size = self.size();
      var fitXScale = (size[0] - padding * 2) / contentSize[0];
      var fitYScale = (size[1] - padding * 2) / contentSize[1];

      // Select scaling factor such that the entire image will fit in both directions
      baseScale = Math.min(fitXScale, fitYScale);
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
