var angular = require('angular');
var $ = require('jquery');
var expect = require('chai').expect;

describe('pagination directive', function() {

  beforeEach(function() {
    var ctx = this;

    angular.mock.module('ngMock', 'epsonreceipts.pagination');
    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.scope.paginationController = $controller('PaginationController', { $scope: ctx.scope });
        var template = '<er-pagination controller="paginationController"></er-pagination>';
        ctx.element = $compile(template)(ctx.scope);
        ctx.previousButton = $(ctx.element.find('button')[0]);
        ctx.nextButton = $(ctx.element.find('button')[1]);
        ctx.totals = ctx.element.find('span');
        ctx.scope.$digest();
      };
    });
    ctx.compile();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('location', function() {
    it('should only display when there are items', function() {
      var ctx = this;
      ctx.scope.paginationController.setLimit(2);
      ctx.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
      ctx.scope.$digest();
      expect(ctx.element.find('span').text()).to.contain('1-2 of 6');
      ctx.scope.paginationController.setItems([]);
      ctx.scope.$digest();
      expect(ctx.element.find('span').length).to.equal(0);
    });

    it('should display the first and last numbers and total', function() {
      var ctx = this;
      ctx.scope.paginationController.setLimit(2);
      ctx.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
      ctx.scope.$digest();
      expect(ctx.element.find('span').text()).to.contain('1-2 of 6');
      ctx.scope.paginationController.next();
      ctx.scope.$digest();
      expect(ctx.element.find('span').text()).to.contain('3-4 of 6');
    });
  });

  describe('navigation buttons', function() {
    context('disabled', function () {
      beforeEach(function() {
        var ctx = this;
        ctx.scope.paginationController.setLimit(6);
        ctx.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
        ctx.scope.$digest();
      });

      it('should have a disabled previous button', function() {
        var ctx = this;
        expect(ctx.scope.paginationController.hasPrevious).to.be.false;
        expect(ctx.previousButton.is(':disabled')).to.be.true;
      });

      it('should have a disabled next button', function() {
        var ctx = this;
        expect(ctx.scope.paginationController.hasNext).to.be.false;
        expect(ctx.nextButton.is(':disabled')).to.be.true;
      });
    });

    context('enabled', function () {
      beforeEach(function() {
        var ctx = this;
        ctx.scope.paginationController.setLimit(2);
        ctx.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
        ctx.scope.$digest();
      });

      it('should have an enabled previous button', function() {
        var ctx = this;
        ctx.scope.paginationController.setSkip(3);
        ctx.scope.$digest();
        expect(ctx.scope.paginationController.hasPrevious).to.be.true;
        expect(ctx.previousButton.is(':disabled')).to.be.false;
      });

      it('should have an enabled next button', function() {
        var ctx = this;
        expect(ctx.scope.paginationController.hasNext).to.be.true;
        expect(ctx.nextButton.is(':disabled')).to.be.false;
      });
    });

    context('changing pages', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.scope.paginationController.setLimit(2);
        ctx.scope.paginationController.setItems(['a', 'b', 'c', 'd', 'e', 'f']);
        ctx.scope.$digest();
      });

      it('should navigate forward with next button', function() {
        var ctx = this;
        expect(ctx.element.find('span').text()).to.contain('1-2 of 6');
        expect(ctx.scope.paginationController.items).to.deep.equal(['a', 'b']);
        ctx.nextButton.click();
        expect(ctx.element.find('span').text()).to.contain('3-4 of 6');
        expect(ctx.scope.paginationController.items).to.deep.equal(['c', 'd']);
      });

      it('should navigate backwards with previous button', function() {
        var ctx = this;
        ctx.nextButton.click();
        expect(ctx.element.find('span').text()).to.contain('3-4 of 6');
        expect(ctx.scope.paginationController.items).to.deep.equal(['c', 'd']);
        ctx.previousButton.click();
        expect(ctx.element.find('span').text()).to.contain('1-2 of 6');
        expect(ctx.scope.paginationController.items).to.deep.equal(['a', 'b']);
      });
    });

  });

});
