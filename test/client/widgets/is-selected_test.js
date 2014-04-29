var angular = require('angular');
var $ = require('jquery');
var expect = require('chai').expect;

describe('isSelected directive', function() {
  beforeEach(function() {
    var ctx = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      ctx.compile = function(template) {
        ctx.scope = $rootScope.$new();
        ctx.scope.selection = {
          isSelected: ctx.sinon.stub(),
          toggleSelection: ctx.sinon.stub()
        };
        ctx.scope.selectionId = '1';


        template = template || '<is-selected selection="selection" selection-id="selectionId"></is-selected>';
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

  context('when not selected', function() {
    it('should not have checked property', function() {
      var ctx = this;
      ctx.scope.selection.isSelected.returns(false);
      ctx.scope.$digest();
      expect($(ctx.wrapper).is(':checked')).to.be.false;
    });
  });

  context('when selected', function() {
    it('should have selected property', function() {
      var ctx = this;
      ctx.scope.selection.isSelected.returns(true);
      ctx.scope.$digest();
      expect($(ctx.wrapper).is(':checked')).to.be.true;
    });
  });

  describe('on change', function() {
    it('should toggle selection when clicked', function() {
      var ctx = this;
      ctx.wrapper.prop('checked', true);
      ctx.wrapper.change();
      expect(ctx.scope.selection.toggleSelection).to.have.been.calledWith('1', true);
    });
  });
});
