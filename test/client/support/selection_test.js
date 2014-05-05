var expect = require('chai').expect;
var _ = require('lodash');
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
    context('with items', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.selection.selectedItems = [
          { id: 1, name: 'a', vowel: true },
          { id: 2, name: 'b', vowel: false },
          { id: 3, name: 'c', vowel: false },
          { id: 4, name: 'd', vowel: false }
        ];
      });

      it('should set visible items', function() {
        var ctx = this;
        ctx.selection.visibleItems = ctx.selection.selectedItems;
        ctx.selection.set({ visibleItems: [{ id: 2, name: 'b', vowel: false }] });
        expect(ctx.selection.visibleItems).to.deep.equal([
          { id: 2, name: 'b', vowel: false }
        ]);
      });

      it('should know if it has a selection', function() {
        var ctx = this;
        expect(ctx.selection.hasSelection()).to.be.true;
      });

      it('should know if it is fully selected', function() {
        var ctx = this;
        expect(ctx.selection.isFullySelected()).to.be.false;
        ctx.selection.visibleItems = ctx.selection.selectedItems;
        expect(ctx.selection.isFullySelected()).to.be.true;
      });

      it('should know if it is partially selected', function() {
        var ctx = this;
        ctx.selection.visibleItems = _.clone(ctx.selection.selectedItems);
        ctx.selection.visibleItems.push({ id: 5, name: 'e', vowel: true });
        expect(ctx.selection.isPartiallySelected()).to.be.true;
        ctx.selection.selectedItems.push({ id: 5, name: 'e', vowel: true });
        expect(ctx.selection.isPartiallySelected()).to.be.false;
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
        ctx.selection.visibleItems = ctx.selection.selectedItems;
        expect(ctx.selection.isFullySelected()).to.be.true;
        ctx.selection.toggleFullSelection();
        expect(ctx.selection.isFullySelected()).to.be.false;
        ctx.selection.toggleFullSelection();
        expect(ctx.selection.isFullySelected()).to.be.true;
      });
    });
  });
});
