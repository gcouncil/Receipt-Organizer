var angular = require('angular');
var expect = require('chai').expect;
var _ = require('lodash');

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

    ctx.user = { id: 1, email: 'test@example.com', settings: { categories: [{ name: 'category1' }] } };

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
      ctx.initScope = $rootScope.$new();
      ctx.deferred = $q.defer();

      ctx.compile = function() {
        ctx.element = $compile('<category-settings></category-settings>')(ctx.initScope);
        ctx.userStorage.updateSettings.returns(ctx.deferred.promise);
        ctx.initScope.$digest();
        ctx.scope = ctx.element.scope();
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
    ctx.user.settings.categories = [ { name: 'category1' } ];
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    ctx.scope.create();
    ctx.scope.$digest();
    var categories = _.map(ctx.scope.categories, function(category) {
      return _.omit(category, '$$hashKey');
    });
    expect(categories).to.deep.equal([ { name: 'category1' }, { name: 'NEW CATEGORY' } ]);
  });

  it('saves', function() {
    var ctx = this;
    ctx.scope.newCategory = 'NEW CATEGORY';
    ctx.user.settings.categories = [ { name: 'category1' } ];
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    ctx.scope.saveCategories();
    ctx.scope.$digest();
    expect(ctx.userStorage.updateSettings).to.have.been.calledWith(ctx.user);
    expect(ctx.notify.success).to.have.been.calledWith('Saved your category preferences.');
  });

  it('cancels preference save', function() {
    var ctx = this;
    ctx.scope.newCategory = 'NEW CATEGORY';
    ctx.user.settings.categories = [ { name: 'category1' } ];
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    ctx.scope.cancel();
    var categories = _.map(ctx.scope.categories, function(category) {
      return _.omit(category, '$$hashKey');
    });
    expect(categories).to.deep.equal( [ { name: 'category1'} ] );
    expect(ctx.notify.info).to.have.been.calledWith('Your changes were cancelled.');
    expect(ctx.state.go).to.have.been.calledWith('items');
  });

  it('deletes', function() {
    var ctx = this;
    ctx.scope.delete({ name: 'category1' });
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    expect(ctx.scope.categories).to.be.empty;
    expect(ctx.notify.success).to.have.been.calledWith('Deleted the category1 category.');
  });
});

