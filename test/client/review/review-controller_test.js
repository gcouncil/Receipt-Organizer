var angular = require('angular');
var expect = require('chai').expect;

describe('review controller', function() {
  beforeEach(function() {
    var self = this;

    self.itemStorage = {
      watch: self.sinon.stub().returns({
        setFilter: self.sinon.stub()
      }),
      query: self.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.review', {
      itemStorage: self.itemStorage
    });
    angular.mock.inject(function($rootScope, $controller) {
      self.scope = $rootScope.$new();
      self.reviewController = $controller('ReviewController', { $scope: self.scope });
      self.scope.$digest();
    });
  });

  describe('initialization', function() {
    it('has no items on initialization', function() {
      expect(this.reviewController.unreviewedItems).to.be.empty;
      expect(this.reviewController.unreviewedTally).to.equal(0);
    });
  });

  describe('query', function() {
    it('fetches the items from item storage', function() {
      var self = this;
      expect(self.itemStorage.watch).to.have.been.calledWith(self.scope);
    });
  });
});


