var angular = require('angular');
var $ = require('jquery');
var expect = require('chai').expect;

describe('pagination directive', function() {

  beforeEach(function() {
    var self = this;

    angular.mock.module('ngMock', 'epsonreceipts');
    angular.mock.inject(function($rootScope, $compile, $controller) {
      self.scope = $rootScope.$new();

      self.compile = function(template) {
        self.scope.paginationController = $controller('PaginationController', { $scope: self.scope });
        template = template || '<er-pagination controller="paginationController"></er-pagination>';
        self.wrapper = $compile('<div>' + template + '</div>')(self.scope);
        self.element = self.wrapper.find('er-pagination');
        self.previousButton = $(self.element.find('button')[0]);
        self.nextButton = $(self.element.find('button')[1]);
        self.totals = self.wrapper.find('span');
        self.scope.$digest();
      };
    });
    self.compile();
  });

  describe('location', function() {
    it('should only display when there are items', function() {
      this.scope.paginationController.setLimit(2);
      this.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
      this.scope.$digest();
      expect(this.element.find('span').text()).to.contain('1-2 of 6');
      this.scope.paginationController.setItems([]);
      this.scope.$digest();
      expect(this.element.find('span').length).to.equal(0);
    });

    it('should display the first and last numbers and total', function() {
      this.scope.paginationController.setLimit(2);
      this.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
      this.scope.$digest();
      expect(this.element.find('span').text()).to.contain('1-2 of 6');
      this.scope.paginationController.next();
      this.scope.$digest();
      expect(this.element.find('span').text()).to.contain('3-4 of 6');
    });
  });

  describe('navigation buttons', function() {
    context('disabled', function () {
      beforeEach(function() {
        this.scope.paginationController.setLimit(6);
        this.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
        this.scope.$digest();
      });

      it('should have a disabled previous button', function() {
        expect(this.scope.paginationController.hasPrevious).to.be.false;
        expect(this.previousButton.is(':disabled')).to.be.true;
      });

      it('should have a disabled next button', function() {
        expect(this.scope.paginationController.hasNext).to.be.false;
        expect(this.nextButton.is(':disabled')).to.be.true;
      });
    });

    context('enabled', function () {
      beforeEach(function() {
        this.scope.paginationController.setLimit(2);
        this.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
        this.scope.$digest();
      });

      it('should have an enabled previous button', function() {
        this.scope.paginationController.setSkip(3);
        this.scope.$digest();
        expect(this.scope.paginationController.hasPrevious).to.be.true;
        expect(this.previousButton.is(':disabled')).to.be.false;
      });

      it('should have an enabled next button', function() {
        expect(this.scope.paginationController.hasNext).to.be.true;
        expect(this.nextButton.is(':disabled')).to.be.false;
      });
    });

    context('changing pages', function() {
      beforeEach(function() {
        this.scope.paginationController.setLimit(2);
        this.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
        this.scope.$digest();
      });

      it('should navigate forward with next button', function() {
        expect(this.element.find('span').text()).to.contain('1-2 of 6');
        expect(this.scope.paginationController.items).to.deep.equal(['a', 'b']);
        this.nextButton.click();
        expect(this.element.find('span').text()).to.contain('3-4 of 6');
        expect(this.scope.paginationController.items).to.deep.equal(['c', 'd']);
      });

      it('should navigate backwards with previous button', function() {
        this.nextButton.click();
        expect(this.element.find('span').text()).to.contain('3-4 of 6');
        expect(this.scope.paginationController.items).to.deep.equal(['c', 'd']);
        this.previousButton.click();
        expect(this.element.find('span').text()).to.contain('1-2 of 6');
        expect(this.scope.paginationController.items).to.deep.equal(['a', 'b']);
      });
    });

  });

});
