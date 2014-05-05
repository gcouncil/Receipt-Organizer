var angular = require('angular');
var expect = require('chai').expect;

describe('scan button directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.twain = {
      driver: 'DRIVER',
      isBusy: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.scanning', {
      twain: ctx.twain
    });

    angular.mock.inject(function($rootScope, $compile, $dropdown) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<scan-button></scan-button>')(ctx.scope);
        ctx.scope.$digest();
        ctx.dropdownScope = ctx.scope.dropdown.$scope;
      };

    });
    ctx.compile();
  });

  it('saves the dropdown into the scope', function() {
    var ctx = this;
    expect(ctx.scope.dropdown).to.be.defined;
  });

  it('destroys the dropdown on $destroy', function() {
    var ctx = this;
    ctx.sinon.spy(ctx.scope.dropdown, 'destroy');
    ctx.scope.$destroy();
    ctx.scope.$digest();
    expect(ctx.scope.dropdown.destroy).to.have.been.called;
  });

  it('shares the twain between the scope and the dropdown', function() {
    var ctx = this;
    expect(ctx.scope.twain).to.equal(ctx.twain);
    expect(ctx.dropdownScope.twain).to.equal(ctx.twain);
  });

  it('should select the driver from the dropdown', function() {
    var ctx = this;
    ctx.dropdownScope.select('my driver');
    ctx.scope.$digest();
    expect(ctx.twain.driver).to.equal('my driver');
  });

  it('should set the short driver name', function() {
    var ctx = this;
    ctx.dropdownScope.select('EPSON driver123');
    ctx.scope.$digest();
    expect(ctx.scope.shortDriverName()).to.equal('driver123');
  });

  it('should check whether a driver is selected', function() {
    var ctx = this;
    ctx.dropdownScope.select('XPdriver2000');
    ctx.scope.$digest();
    expect(ctx.dropdownScope.isSelected('EPSON 2000')).to.be.false;
    expect(ctx.dropdownScope.isSelected('XPdriver2000')).to.be.true;
  });

  it('should watch whether twain is busy', function() {
    var ctx = this;
    ctx.dropdownScope.select('EPSON DS-510');
    ctx.twain.isBusy.returns(true);
    ctx.scope.$digest();
    expect(ctx.scope.scannerBusy).to.be.true;
  });

});
