var angular = require('angular');
var expect = require('chai').expect;
var _ = require('lodash');

describe('new settings input', function() {
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
      notify: ctx.notify,
      $state: ctx.state,
      currentUser: ctx.currentUser,
      userStorage: ctx.userStorage
    });

    angular.mock.inject(function($rootScope, $compile, $q) {
      ctx.parentScope = $rootScope.$new();
      ctx.childScope = ctx.parentScope.$new();
      //ctx.deferred = $q.defer();
      //ctx.userStorage.updateSettings.returns(ctx.deferred.promise);

      ctx.compile = function() {
        ctx.parentElement = $compile('<user-settings></user-settings>')(ctx.parentScope);
        ctx.parentScope.$digest();

        ctx.childElement = angular.element('<new-settings-input collection="categories"></new-settings-input>');
        ctx.parentElement.append(ctx.childElement);

        ctx.element = $compile(ctx.childElement)(ctx.childScope);
        ctx.childScope.$digest();
      };
    });
    ctx.compile();
    ctx.isolateScope = ctx.element.isolateScope();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.childScope) {
      ctx.childScope.$destroy();
    }
    if (ctx.parentScope) {
      ctx.parentScope.$destroy();
    }
    if (ctx.isolateScope) {
      ctx.isolateScope.$destroy();
    }
  });

  it('starts with a null new setting', function() {
    var ctx = this;
    expect(ctx.isolateScope.newSetting).to.be.null;
  });

  it('creates a new setting', function() {
    var ctx = this;
    expect(_.contains(ctx.parentScope.categories, 'Movies')).to.be.false;
    ctx.isolateScope.newSetting = 'Movies';
    ctx.isolateScope.create();
    ctx.isolateScope.$digest();
    expect(_.contains(ctx.parentScope.categories, 'Movies')).to.be.true;
  });
});
