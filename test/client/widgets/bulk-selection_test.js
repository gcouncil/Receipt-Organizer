var angular = require('angular');
var $ = require('jquery');
var expect = require('chai').expect;

describe('bulkSelection directive', function() {
  beforeEach(function() {
    var ctx = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      ctx.compile = function(template) {
        ctx.scope = $rootScope.$new();

        ctx.scope.selection = {
          toggleFullSelection: ctx.sinon.stub(),
          hasSelection: ctx.sinon.stub(),
          isPartiallySelected: ctx.sinon.stub()
        };
        template = template || '<bulk-selection selection="selection"></bulk-selection>';
        ctx.wrapper = $compile(template)(ctx.scope);
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

  it('should display as not checked when the selection is empty', function() {
    var ctx = this;
    ctx.scope.selection.hasSelection.returns(false);
    ctx.scope.selection.isPartiallySelected.returns(false);

    ctx.scope.$digest();

    expect($(ctx.wrapper).find('input:checkbox').is(':checked')).to.be.false;
    expect($(ctx.wrapper).find('input:checkbox').is(':indeterminate')).to.be.false;
  });

  it('should display as checked when the selection is complete', function() {
    var ctx = this;
    ctx.scope.selection.hasSelection.returns(true);
    ctx.scope.selection.isPartiallySelected.returns(false);

    ctx.scope.$digest();

    expect($(ctx.wrapper).find('input:checkbox').is(':checked')).to.be.true;
    expect($(ctx.wrapper).find('input:checkbox').is(':indeterminate')).to.be.false;
  });

  it('should display as indeterminate when the selection is partial', function() {
    var ctx = this;
    ctx.scope.selection.hasSelection.returns(true);
    ctx.scope.selection.isPartiallySelected.returns(true);

    ctx.scope.$digest();

    // NOTE: Chrome will always return false for is(':checked') whenever it is indeterminate
    // expect($(ctx.wrapper).find('input:checkbox').is(':checked')).to.be.true;
    expect($(ctx.wrapper).find('input:checkbox').is(':indeterminate')).to.be.true;
  });

  it('should toggle selection when clicked', function() {
    var ctx = this;
    ctx.wrapper.click();

    expect(ctx.scope.selection.toggleFullSelection).to.have.been.called;
  });
});
