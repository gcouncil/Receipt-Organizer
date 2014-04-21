var expect = require('chai').expect;

describe('isSelected directive', function() {
  var elm, scope;

  beforeEach(function() {

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      elm = angular.element(
      '<table>' +
        '<thead>' +
          '<tr>' +
            '<th></th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          '<tr>' +
            '<td>' +
              '<is-selected selection="selection" selection-id="1"></is-selected>' +
            '</td>' +
          '</tr>' +
        '</tbody>' +
      '</table>');
      scope = $rootScope.$new();
      $compile(elm)(scope);
      scope.$digest();
    });
  });
  context('when not selected', function() {
    it('should not have selected property', function() {
      var rows = elm.find('tr');
      console.log(rows.eq(0));
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
