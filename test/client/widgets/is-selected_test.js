var angular = require('angular');
var $ = require('jquery');
var expect = require('chai').expect;

describe('isSelected directive', function() {
  beforeEach(function() {
    var self = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      self.compile = function(template) {
        self.scope = $rootScope.$new();
        self.scope.selection = {
          isSelected: self.sinon.stub(),
          toggleSelection: self.sinon.stub()
        };
        self.scope.selectionId = '1';


        template = template || '<is-selected selection="selection" selection-id="selectionId"></is-selected>';
        self.wrapper = $compile(template)(self.scope);
        self.scope.$digest();
      };
    });
    this.compile();
  });

  context('when not selected', function() {
    it('should not have checked property', function() {
      this.scope.selection.isSelected.returns(false);
      this.scope.$digest();
      expect($(this.wrapper).is(':checked')).to.be.false;
    });
  });

  context('when selected', function() {
    it('should have selected property', function() {
      this.scope.selection.isSelected.returns(true);
      this.scope.$digest();
      expect($(this.wrapper).is(':checked')).to.be.true;
    });
  });

  describe('on change', function() {
    it('should toggle selection when clicked', function() {
      this.wrapper.prop('checked', true);
      this.wrapper.change();
      expect(this.scope.selection.toggleSelection).to.have.been.calledWith('1', true);
    });
  });
});
