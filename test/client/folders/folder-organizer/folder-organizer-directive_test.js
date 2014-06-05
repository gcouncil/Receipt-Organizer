var angular = require('angular');
var expect = require('chai').expect;

describe('folder organizer directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.folderStorage = {
      query: ctx.sinon.stub(),
      update: ctx.sinon.stub(),
      destroy: ctx.sinon.stub()
    };

    ctx.state = {
      state: 'STATE',
      params: {
        folder: 'FOLDER'
      },
      $current: {
        name: 'items'
      },
      go: ctx.sinon.stub()
    };

    ctx.itemStorage = {
      watch: ctx.sinon.stub(),
      notify: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.folders', {
      folderStorage: ctx.folderStorage,
      itemStorage: ctx.itemStorage,
      $state: ctx.state
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.compile = function() {
        ctx.element = $compile('<folder-organizer></folder-organizer>')(ctx.scope);
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

  it('should set the scopes state to the state service', function() {
    var ctx = this;
    expect(ctx.scope.$state).to.equal(ctx.state);
  });

  it('should query folderStorage', function() {
    var ctx = this;
    ctx.folders = ['FOLDER1', 'FOLDER1'];
    ctx.folderStorage.query.returns(ctx.folders);
    ctx.scope.$digest();
    expect(ctx.folderStorage.query).to.have.been.called;
  });
});
