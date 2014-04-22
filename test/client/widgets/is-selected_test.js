var expect = require('chai').expect;

describe('isSelected directive', function() {
  var elm, scope;

  beforeEach(function() {

    angular.injector(['ngMock', 'epsonreceipts.widgets']).invoke(function($rootScope, $compile) {
      elm = angular.element(
        '<input type=checkbox>'
      );
      scope = $rootScope.$new();
      $compile(elm)(scope);
      scope.$digest();
    });
  });
  context('when not selected', function() {
    it('should not have selected property', function() {
      scope.$apply(function() {
        scope.selection = {};
      });
      console.log(elm);
      //expect(elm.html()).toContain("Hello");
      //var checkbox = elm.find('input');
      //console.log(checkbox);
      //console.log(elm.find('input'));
      //row to not have selected property
    });
  });

  context('when selected', function() {
    xit('should have selected property', function() {
      var checkbox = elm.find('checkbox');
      checkbox.click();
      //expect row to have selected property
    });
  });
});
