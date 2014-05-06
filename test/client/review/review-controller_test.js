var angular = require('angular');
var expect = require('chai').expect;

describe('review controller', function() {
  beforeEach(function() {
    var self = this;

    angular.mock.module('ngMock', 'epsonreceipts.review');
    angular.mock.inject(function($rootScope, $controller) {
      self.scope = $rootScope.$new();

      self.reviewController = $controller('ReviewController', { $scope: self.scope });
      self.scope.$digest();
    });
  });

  describe('initialization', function() {
    it('has no items on initialization', function() {
      expect(this.reviewController.allItems).to.be.empty;
      expect(this.reviewController.unreviewedItems).to.be.empty;
      expect(this.reviewController.unreviewedTally).to.equal(0);
    });
  });

  describe('setItems', function() {
    it('should add the items to itself', function() {
      this.reviewController.setItems(['a', 'b']);
      expect(this.reviewController.allItems.length).to.equal(2);
    });

    it('should update unreviewedItems and unreviewedTally', function() {
      this.reviewController.setItems([{reviewed: true}, {reviewed: false}, {reviewed: false}]);
      expect(this.reviewController.allItems.length).to.equal(3);
      expect(this.reviewController.unreviewedItems.length).to.equal(2);
      expect(this.reviewController.unreviewedTally).to.equal(2);
    });
  });
});


