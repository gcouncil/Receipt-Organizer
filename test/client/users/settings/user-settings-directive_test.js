var angular = require('angular');
var expect = require('chai').expect;

describe('user settings directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.notify = {
      success: ctx.sinon.stub(),
      info: ctx.sinon.stub()
    };

    ctx.state = {
      $current: {
        name: 'CURRENT.PAGE'
      },
      href: ctx.sinon.stub(),
      get: ctx.sinon.stub(),
      go: ctx.sinon.stub()
    };

    ctx.currentUser = {
      get: ctx.sinon.stub().returns( { settings: { categories: ['category1'] } } ),
      set: ctx.sinon.stub()
    };

    ctx.userStorage = {
      create: ctx.sinon.stub(),
      updateSettings: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.users.settings', {
      $state: ctx.state,
      notify: ctx.notify,
      currentUser: ctx.currentUser,
      userStorage: ctx.userStorage
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<user-settings></user-settings>')(ctx.scope);
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

  context('setup', function() {
    it('gets the suffix of the current state name', function() {
      var ctx = this;
      expect(ctx.scope.currentPage).to.equal('PAGE');
    });

    it('checks the current page', function() {
      var ctx = this;
      expect(ctx.scope.isCurrentPage('PAGE')).to.be.true;
      expect(ctx.scope.isCurrentPage('MCGUFFIN')).to.be.false;
    });
  });
});
