var expect = require('chai').expect;

var extendedZoom = require('epson-receipts/client/imageviewer/support/extended-zoom');

describe('Extended Zoom', function() {
  describe('.translate', function() {
    it('should maintain a minimum overlap', function() {
      var zoom = extendedZoom({ padding: 0, overlap: 10 });

      zoom.size([100, 100]);
      zoom.contentSize([100, 100]);

      zoom.translate([-99999, -99999]);
      expect(zoom.translate()).to.deep.equal([-90, -90]);

      zoom.translate([-99999, 99999]);
      expect(zoom.translate()).to.deep.equal([-90, 90]);

      zoom.translate([99999, 99999]);
      expect(zoom.translate()).to.deep.equal([90, 90]);
    });
  });

  describe('.scale', function() {
    it('should contstrain to a reasonable range', function() {
      var zoom = extendedZoom({ padding: 0, overlap: 10 });

      zoom.size([100, 100]);
      zoom.contentSize([200, 200]);

      zoom.scale(0);
      expect(zoom.scale()).to.equal(0.5);

      zoom.scale(Infinity);
      expect(zoom.scale()).to.equal(4); // max scale of two time the native resolution of content
    });

    it('should support maintaining center when scaling', function() {
      var zoom = extendedZoom({ padding: 0, overlap: 10 });

      zoom.size([100, 100]);
      zoom.contentSize([100, 100]);

      zoom.scale(0.5);
      zoom.translate([0, 0]);
      expect(zoom.contentSize()).to.deep.equal([50, 50]);

      zoom.scale(1, true);
      expect(zoom.scale()).to.equal(1);
      expect(zoom.contentSize()).to.deep.equal([100, 100]);
      expect(zoom.translate()).to.deep.equal([-50, -50]);
    });
  });

  describe('.contentSize', function() {
    it('should maintain the correct aspect ratio', function() {
      var zoom = extendedZoom({ padding: 10, overlap: 10 });

      zoom.size([100, 200]);
      zoom.contentSize([4000, 3000]);

      var contentSize = zoom.contentSize();
      expect(contentSize[0] / contentSize[1]).to.equal(4/3);
    });

    it('should scale base size to fit in viewer with padding', function() {
      var zoom = extendedZoom({ padding: 10, overlap: 10 });

      zoom.size([100, 100]);

      zoom.contentSize([50, 50]);
      expect(zoom.contentSize()).to.deep.equal([80, 80]);

      zoom.contentSize([1000, 1000]);
      expect(zoom.contentSize()).to.deep.equal([80, 80]);
    });
  });

  describe('.reset', function() {
    it('should reset the scale to 1', function() {
      var zoom = extendedZoom({ padding: 10, overlap: 10 });

      zoom.size([200, 400]);
      zoom.contentSize([200, 100]);

      zoom.reset();

      expect(zoom.scale()).to.equal(1);
    });

    it('should re-center the content', function() {
      var zoom = extendedZoom({ padding: 10, overlap: 10 });

      zoom.size([200, 400]);
      zoom.contentSize([200, 100]);

      zoom.reset();

      expect(zoom.translate()).to.deep.equal([10, 155]);
    });
  });
});
