var angular = require('angular');
var expect = require('chai').expect;

describe('form field settings directive', function() {
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

    ctx.user = { id: 1, email: 'test@example.com', settings: { fields: [ { name: 'field1', selected: true } ] } };

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
        ctx.element = $compile('<form-field-settings></form-field-settings>')(ctx.scope);
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

  it('saves', function() {
    var ctx = this;
    ctx.scope.newField = { name: 'NEW FIELD', selected: false };
    ctx.user.settings.fields = [
      { name: 'field1', selected: true },
      { name: 'NEW FIELD', selected: false }
    ];
    ctx.scope.$digest();
    ctx.deferred.resolve(ctx.user);
    ctx.scope.save();
    ctx.scope.$digest();
    expect(ctx.scope.fields).to.deep.equal(ctx.user.settings.fields);
    expect(ctx.notify.success).to.have.been.calledWith('Saved your form field preferences.');
  });

  it('cancels preference save', function() {
    var ctx = this;
    ctx.scope.newField = 'NEW FIELD';
    ctx.user.settings.fields = [ 'field1', 'NEW FIELD' ];
    ctx.deferred.resolve(ctx.user);
    ctx.scope.$digest();
    ctx.scope.cancel();
    expect(ctx.scope.fields).not.to.deep.equal(ctx.user.settings.fields);
    expect(ctx.notify.info).to.have.been.calledWith('Your changes were cancelled.');
    expect(ctx.state.go).to.have.been.calledWith('items');
  });
});


