var angular = require('angular');
var expect = require('chai').expect;

describe.only('pagination controller', function() {

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
      this.paginationController.setItems(['a', 'b'], 2);
      expect(this.paginationController.total).to.equal(2);
    });
  });

});


