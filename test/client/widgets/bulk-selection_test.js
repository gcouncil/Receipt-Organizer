var angular = require('angular');
var $ = require('jquery');
var expect = require('chai').expect;

describe('bulkSelection directive', function() {
  beforeEach(function() {
    var self = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      self.compile = function(template) {
        self.scope = $rootScope.$new();

        self.scope.selection = {
          toggleFullSelection: self.sinon.stub(),
          hasSelection: self.sinon.stub(),
          isPartiallySelected: self.sinon.stub()
        };
        template = template || '<bulk-selection selection="selection"></bulk-selection>';
        self.wrapper = $compile(template)(self.scope);
        self.scope.$digest();
      };
    });

    this.compile();

    it('should display as not checked when the selection is empty', function() {
      this.scope.selection.hasSelection.returns(false);
      this.scope.selection.isPartiallySelected.returns(false);

      this.scope.$digest();

      expect($(this.wrapper).find('input:checkbox').is(':checked')).to.be.false;
      expect($(this.wrapper).find('input:checkbox').is(':indeterminate')).to.be.false;
    });

    it('should display as checked when the selection is complete', function() {
      this.scope.selection.hasSelection.returns(true);
      this.scope.selection.isPartiallySelected.returns(false);

      this.scope.$digest();

      expect($(this.wrapper).find('input:checkbox').is(':checked')).to.be.true;
      expect($(this.wrapper).find('input:checkbox').is(':indeterminate')).to.be.false;
    });

    it('should display as indeterminate when the selection is partial', function() {
      this.scope.selection.hasSelection.returns(true);
      this.scope.selection.isPartiallySelected.returns(true);

      this.scope.$digest();

      // NOTE: Chrome will always return false for is(':checked') whenever it is indeterminate
      // expect($(this.wrapper).find('input:checkbox').is(':checked')).to.be.true;
      expect($(this.wrapper).find('input:checkbox').is(':indeterminate')).to.be.true;
    });

    it('should toggle selection when clicked', function() {
      this.wrapper.click();

      expect(this.scope.selection.toggleFullSelection).to.have.been.called;
    });
  });
});
