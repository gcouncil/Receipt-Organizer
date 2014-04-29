var angular = require('angular');
var expect = require('chai').expect;

describe('notices directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.notify = {
      notices: []
    };

    angular.mock.module('ngMock', 'epsonreceipts.notify', { notify: ctx.notify });
    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<notices></notices>')(ctx.scope);
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

  describe('view', function() {
    it('displays notices', function() {
      var ctx = this;
      ctx.notify.notices.push({
        message: 'hello',
        type: 'success'
      });
      ctx.scope.$digest();

      var alert = angular.element(ctx.element.children()[0]);
      expect(alert.text()).to.contain('hello');
      expect(alert.hasClass('alert-success')).to.be.true;
    });

    it('displays mulitple notices', function() {
      var ctx = this;
      ctx.notify.notices.push({
        message: 'arrh',
        type: 'danger'
      }, {
        message: 'fyi',
        type: 'info'
      });
      ctx.scope.$digest();

      expect(ctx.element.find('.alert').length).to.equal(2);
    });
  });
});
