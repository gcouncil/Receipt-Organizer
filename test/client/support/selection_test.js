var expect = require('chai').expect;
var Selection = require('../../../lib/client/support/selection.js');

describe('selection', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.selection = new Selection();
  });

  describe('initialization', function() {

    it('should have no visible items', function() {
      var ctx = this;
      expect(ctx.selection.visibleItems).to.deep.equal([]);
    });

    it('should have nothing selected', function() {
      var ctx = this;
      expect(ctx.selection.selected).to.deep.equal({});
    });

    it('should have no selected items', function() {
      var ctx = this;
      expect(ctx.selection.selectedItems).to.deep.equal([]);
    });

  });

  describe('methods', function() {
    it('should set visible items', function() {
      var ctx = this;
      expect(ctx.selection.visibleItems).to.deep.equal([]);
      ctx.selection.set({ visibleItems: [{ id: 2, name: 'b', vowel: false }] });
      expect(ctx.selection.visibleItems).to.deep.equal([
        { id: 2, name: 'b', vowel: false }
      ]);
    });

    context('with items', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.selection.set({
          visibleItems: [
            { id: 1, name: 'a', vowel: true },
            { id: 2, name: 'b', vowel: false },
            { id: 3, name: 'c', vowel: false },
            { id: 4, name: 'd', vowel: false }
          ]
        });
      });


      it('should know if it has a selection', function() {
        var ctx = this;
        expect(ctx.selection.hasSelection()).to.be.false;
        ctx.selection.toggleSelection(1, true);
        expect(ctx.selection.hasSelection()).to.be.true;
      });

      it('should know if it is fully selected', function() {
        var ctx = this;
        expect(ctx.selection.isFullySelected()).to.be.false;
        ctx.selection.toggleSelection(1, true);
        ctx.selection.toggleSelection(2, true);
        ctx.selection.toggleSelection(3, true);
        ctx.selection.toggleSelection(4, true);
        expect(ctx.selection.isFullySelected()).to.be.true;
      });

      it('should know if it is partially selected', function() {
        var ctx = this;
        expect(ctx.selection.isPartiallySelected()).to.be.false;
        ctx.selection.toggleSelection(1, true);
        expect(ctx.selection.isPartiallySelected()).to.be.true;
      });

      it('should know whether a particular item is selected', function() {
        var ctx = this;
        ctx.selection.toggleSelection(2, true);
        expect(ctx.selection.isSelected(2)).to.be.true;
      });

      it('should toggleSelection', function() {
        var ctx = this;
        ctx.selection.toggleSelection(2, true);
        expect(ctx.selection.isSelected(2)).to.be.true;
        ctx.selection.toggleSelection(2, false);
        expect(ctx.selection.isSelected(2)).to.be.false;
      });

      it('should toggleFullSelection', function() {
        var ctx = this;
        expect(ctx.selection.isFullySelected()).to.be.false;
        ctx.selection.toggleFullSelection();
        expect(ctx.selection.isFullySelected()).to.be.true;
        ctx.selection.toggleFullSelection();
        expect(ctx.selection.isFullySelected()).to.be.false;
      });
    });
  });

});
