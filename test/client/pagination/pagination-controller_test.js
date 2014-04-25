var angular = require('angular');
var expect = require('chai').expect;

describe('pagination controller', function() {

  beforeEach(function() {
    var self = this;

    angular.mock.module('ngMock', 'epsonreceipts');
    angular.mock.inject(function($rootScope, $controller) {
      self.scope = $rootScope.$new();

      self.paginationController = $controller('PaginationController', { $scope: self.scope });
      self.scope.$digest();
    });
  });

  describe('initialization', function() {
    it('has no items on initialization', function() {
      expect(this.paginationController.items).to.be.empty;
      expect(this.paginationController.total).to.equal(0);
      expect(this.paginationController.first).to.equal(1);
      expect(this.paginationController.last).to.equal(0);
      expect(this.paginationController.hasNext).to.be.false;
      expect(this.paginationController.hasPrevious).to.be.false;
    });
  });

  describe('setItems', function() {
    it('should add the items to itself', function() {
      this.paginationController.setLimit(2);
      this.paginationController.setItems(['a', 'b'], 2);
      expect(this.paginationController.total).to.equal(2);
      expect(this.paginationController.items).to.deep.equal(['a', 'b']);
      expect(this.paginationController.first).to.equal(1);
      expect(this.paginationController.last).to.equal(2);
    });
  });

  describe('setSkip and setLimit', function() {
    it('should paginate from skip to the limit', function() {
      this.paginationController.setLimit(2);
      this.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], 8);
      expect(this.paginationController.items).to.deep.equal(['a', 'b']);
      this.paginationController.setSkip(2);
      expect(this.paginationController.items).to.deep.equal(['c', 'd']);
      this.paginationController.setSkip(7);
      expect(this.paginationController.items).to.deep.equal(['h']);
    });
  });

  describe('next', function() {
    it('should update the items to the next page', function() {
      this.paginationController.setLimit(2);
      this.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f'], 6);
      expect(this.paginationController.items).to.deep.equal(['a', 'b']);
      this.paginationController.next();
      expect(this.paginationController.items).to.deep.equal(['c', 'd']);
      this.paginationController.next();
      expect(this.paginationController.items).to.deep.equal(['e', 'f']);
    });
  });

  describe('previous', function() {
    it('should update the items to the previous page', function() {
      this.paginationController.setLimit(2);
      this.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f'], 6);
      this.paginationController.setSkip(4);
      expect(this.paginationController.items).to.deep.equal(['e', 'f']);
      this.paginationController.previous();
      expect(this.paginationController.items).to.deep.equal(['c', 'd']);
      this.paginationController.previous();
      expect(this.paginationController.items).to.deep.equal(['a', 'b']);
    });
  });


  describe('events', function() {
    it('should emit change event on update', function() {
      var onChange = this.sinon.stub();
      this.paginationController.on('change', onChange);
      this.paginationController.setSkip(1);
      expect(onChange).to.have.been.called;
    });
  });
});

