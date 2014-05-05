var angular = require('angular');
var expect = require('chai').expect;

describe('tag organizer directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.tagStorage = {
      query: ctx.sinon.stub(),
      update: ctx.sinon.stub(),
      destroy: ctx.sinon.stub()
    };
    ctx.state = {
      state: 'STATE',
      $current: ctx.sinon.stub(),
      go: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.tags', {
      tagStorage: ctx.tagStorage,
      $state: ctx.state
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.compile = function() {
        ctx.element = $compile('<tag-organizer></tag-organizer>')(ctx.scope);
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

  it('should query tagStorage', function() {
    var ctx = this;
    ctx.tags = ['TAG1', 'TAG1'];
    ctx.tagStorage.query.returns(ctx.tags);
    ctx.scope.$digest();
    expect(ctx.tagStorage.query).to.have.been.called;
  });

  it('should delete a tag', function() {
    var ctx = this;
    ctx.scope.delete('TAG');
    ctx.scope.$digest();
    expect(ctx.tagStorage.destroy).to.have.been.calledWith('TAG');
  });

  it('should filter tags', function() {
    var ctx = this;
    ctx.scope.filter('billable');
    ctx.scope.$digest();
    expect(ctx.state.go).to.have.been.calledWith(ctx.state.$current, { tag: 'billable' });
  });

  it('should update a tag and turn off the edit panel', function() {
    var ctx = this;
    ctx.tag = { name: 'TAG', showEdit: true };
    ctx.scope.update(ctx.tag);
    ctx.scope.$digest();
    expect(ctx.tagStorage.update).to.have.been.calledWith(ctx.tag);
    expect(ctx.tag.showEdit).to.be.false;
  });

  it('should hide the edit panel', function() {
    var ctx = this;
    ctx.tag = { name: 'TAG', showEdit: true };
    ctx.scope.noEdit(ctx.tag);
    ctx.scope.$digest();
    expect(ctx.tag.showEdit).to.be.false;
  });
});
