var angular = require('angular');
var expect = require('chai').expect;

describe('category settings directive', function() {
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

    ctx.user = { id: 1, email: 'test@example.com', settings: { categories: ['category1'] } };

    ctx.currentUser = {
      get: ctx.sinon.stub().returns(ctx.user),
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
      ctx.scope = $rootScope.$new();
      ctx.deferred = $q.defer();

      ctx.compile = function() {
        ctx.element = $compile('<category-settings></category-settings>')(ctx.scope);
        ctx.userStorage.updateSettings.returns(ctx.deferred.promise);
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

  it('gets the current user', function() {
    var ctx = this;
    expect(ctx.scope.currentUser).to.equal(ctx.user);
  });

  it('creates a new category', function() {
    var ctx = this;
    ctx.scope.newCategory = 'NEW CATEGORY';
    ctx.user.settings.categories = [ 'category1', 'NEW CATEGORY' ];
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    ctx.scope.create();
    ctx.scope.$digest();
    expect(ctx.scope.categories).to.deep.equal(ctx.user.settings.categories);
  });

  it('saves', function() {
    var ctx = this;
    ctx.scope.newCategory = 'NEW CATEGORY';
    ctx.user.settings.categories = [ 'category1', 'NEW CATEGORY' ];
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    ctx.scope.saveCategories();
    ctx.scope.$digest();
    expect(ctx.scope.categories).to.deep.equal(ctx.user.settings.categories);
    expect(ctx.notify.success).to.have.been.calledWith('Saved your category preferences.');
  });

  it('cancels preference save', function() {
    var ctx = this;
    ctx.scope.newCategory = 'NEW CATEGORY';
    ctx.user.settings.categories = [ 'category1', 'NEW CATEGORY' ];
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    ctx.scope.cancel();
    expect(ctx.scope.categories).not.to.deep.equal(ctx.user.settings.categories);
    expect(ctx.notify.info).to.have.been.calledWith('Your changes were cancelled.');
    expect(ctx.state.go).to.have.been.calledWith('items');
  });

  it('deletes', function() {
    var ctx = this;
    ctx.scope.delete('category1');
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    expect(ctx.scope.categories).to.be.empty;
    expect(ctx.notify.success).to.have.been.calledWith('Deleted the category1 category.');
  });
});

