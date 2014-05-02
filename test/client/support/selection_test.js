var expect = require('chai').expect;
var _ = require('lodash');
var Selection = require('../../../lib/client/support/selection.js');

describe.only('selection', function() {
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

      xit('should set attributes', function() {
        var ctx = this;
        ctx.selection.visibleItems = ctx.selection.selectedItems;
        ctx.selection.set({ name: 'b'});
        expect(ctx.selection.selectedItems).to.deep.equal([
          { id: 1, name: 'a', vowel: true }
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
        expect(ctx.selection.isSelected(2)).not.to.be.false;
      });

      it('toggleSelection', function() {
        var ctx = this;
        expect(ctx.selection.isSelected(2)).not.to.be.false;
        ctx.selection.toggleSelection(2);
        expect(ctx.selection.isSelected(2)).to.be.false;
      });
    });
  });

});
