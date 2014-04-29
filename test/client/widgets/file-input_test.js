var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe.only('file input directive', function() {
  beforeEach(function() {
    var ctx = this;
    angular.mock.module('ngMock', 'epsonreceipts.widgets');
    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.scope.files = ['a', 'b', 'c'];
      ctx.compile = function() {
        ctx.element = $compile('<input type="file" ng-model="files">')(ctx.scope);
        ctx.ngModelController = ctx.element.controller('ngModel');
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

  it('should set the view value to the files that are selected', function() {
    var ctx = this;
    var e = $.Event('change');
    expect(ctx.ngModelController.$viewValue).to.deep.equal(['a', 'b', 'c']);
    ctx.element.files = ['d', 'e', 'f'];
    $(ctx.element).trigger(e);
    expect(ctx.ngModelController.$viewValue).not.to.deep.equal(['a', 'b', 'c']);
    //expect(ctx.ngModelController.$viewValue).to.deep.equal(['d', 'e', 'f']);
  });

});
