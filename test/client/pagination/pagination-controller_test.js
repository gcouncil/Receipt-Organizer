var angular = require('angular');
var expect = require('chai').expect;

describe('pagination controller', function() {

  beforeEach(function() {
    var ctx = this;

    angular.mock.module('ngMock', 'epsonreceipts.pagination');
    angular.mock.inject(function($rootScope, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.paginationController = $controller('PaginationController', { $scope: ctx.scope });
      ctx.scope.$digest();
    });
  });

  describe('initialization', function() {
    it('has no items on initialization', function() {
      var ctx = this;
      expect(ctx.paginationController.items).to.be.empty;
      expect(ctx.paginationController.total).to.equal(0);
      expect(ctx.paginationController.first).to.equal(1);
      expect(ctx.paginationController.last).to.equal(0);
      expect(ctx.paginationController.hasNext).to.be.false;
      expect(ctx.paginationController.hasPrevious).to.be.false;
    });
  });

  describe('setItems', function() {
    it('should add the items to itself', function() {
      var ctx = this;
      ctx.paginationController.setLimit(2);
      ctx.paginationController.setItems(['a', 'b'], 2);
      expect(ctx.paginationController.total).to.equal(2);
      expect(ctx.paginationController.items).to.deep.equal(['a', 'b']);
      expect(ctx.paginationController.first).to.equal(1);
      expect(ctx.paginationController.last).to.equal(2);
    });
  });

  describe('setSkip and setLimit', function() {
    it('should paginate from skip to the limit', function() {
      var ctx = this;
      ctx.paginationController.setLimit(2);
      ctx.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], 8);
      expect(ctx.paginationController.items).to.deep.equal(['a', 'b']);
      ctx.paginationController.setSkip(2);
      expect(ctx.paginationController.items).to.deep.equal(['c', 'd']);
      ctx.paginationController.setSkip(7);
      expect(ctx.paginationController.items).to.deep.equal(['h']);
    });
  });

  describe('next', function() {
    it('should update the items to the next page', function() {
      var ctx = this;
      ctx.paginationController.setLimit(2);
      ctx.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f'], 6);
      expect(ctx.paginationController.items).to.deep.equal(['a', 'b']);
      ctx.paginationController.next();
      expect(ctx.paginationController.items).to.deep.equal(['c', 'd']);
      ctx.paginationController.next();
      expect(ctx.paginationController.items).to.deep.equal(['e', 'f']);
    });
  });

  describe('previous', function() {
    it('should update the items to the previous page', function() {
      var ctx = this;
      ctx.paginationController.setLimit(2);
      ctx.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f'], 6);
      ctx.paginationController.setSkip(4);
      expect(ctx.paginationController.items).to.deep.equal(['e', 'f']);
      ctx.paginationController.previous();
      expect(ctx.paginationController.items).to.deep.equal(['c', 'd']);
      ctx.paginationController.previous();
      expect(ctx.paginationController.items).to.deep.equal(['a', 'b']);
    });
  });


  describe('events', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.onChange = ctx.sinon.stub();
      ctx.paginationController.on('change', ctx.onChange);
    });

    it('should emit change event on setSkip', function() {
      var ctx = this;
      ctx.paginationController.setSkip(1);
      expect(ctx.onChange).to.have.been.called;
    });

    it('should emit change event on setItems', function() {
      var ctx = this;
      ctx.paginationController.setItems(['a', 'b']);
      expect(ctx.onChange).to.have.been.called;
    });

    it('should emit change event on setLimit', function() {
      var ctx = this;
      ctx.paginationController.setLimit(4);
      expect(ctx.onChange).to.have.been.called;
    });

    it('should emit change event on next if it has items', function() {
      var ctx = this;
      ctx.paginationController.setLimit(2);
      ctx.paginationController.setItems(['a', 'b', 'c', 'd']);
      ctx.paginationController.next();
      expect(ctx.onChange).to.have.callCount(3);
    });

    it('should emit change event on previous if it has items', function() {
      var ctx = this;
      ctx.paginationController.setLimit(2);
      ctx.paginationController.setSkip(2);
      ctx.paginationController.setItems(['a', 'b', 'c', 'd']);
      ctx.paginationController.previous();
      expect(ctx.onChange).to.have.callCount(4);
    });
  });
});

