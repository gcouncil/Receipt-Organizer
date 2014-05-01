var angular = require('angular');
var expect = require('chai').expect;

describe('tag actions directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.tagStorage = {
      update: ctx.sinon.stub(),
      destroy: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.tags', {
      tagStorage: ctx.tagStorage
    });

    angular.mock.inject(function($rootScope, $compile, $dropdown) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.scope.tag = { id: 1, name: 'TAG1' };
        ctx.element = $compile('<tag-actions tag="tag" class="dropdown"></tag-actions>')(ctx.scope);
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

  it('sets the dropdown', function() {
    var ctx = this;
    ctx.scope.$digest();
    expect(ctx.element.isolateScope().dropdown).not.to.be.undefined;
  });

  it('destroys the dropdown on $destroy', function() {
    var ctx = this;
    ctx.sinon.spy(ctx.element.isolateScope().dropdown, 'destroy');
    ctx.scope.$destroy();
    ctx.scope.$digest();
    expect(ctx.element.isolateScope().dropdown.destroy).to.have.been.called;
  });

  it('sets the dropdown tag to the scopes tag', function() {
    var ctx = this;
    expect(ctx.element.isolateScope().dropdown.$scope.tag).to.equal(ctx.scope.tag);
  });

  it('updates tags in the dropdown', function() {
    var ctx = this;
    ctx.element.isolateScope().dropdown.$scope.update('TAG');
    expect(ctx.tagStorage.update).to.have.been.calledWith('TAG');
  });

  it('deletes tags in the dropdown', function() {
    var ctx = this;
    ctx.element.isolateScope().dropdown.$scope.delete('TAG');
    expect(ctx.tagStorage.destroy).to.have.been.calledWith('TAG');
  });

  it('toggles the edit flag', function() {
    var ctx = this;
    var tag = ctx.element.isolateScope().dropdown.$scope.tag;
    expect(tag.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.toggleEdit(tag);
    expect(tag.showEdit).to.be.true;
    ctx.element.isolateScope().dropdown.$scope.toggleEdit(tag);
    expect(tag.showEdit).to.be.false;
  });

  it('turns editing off', function() {
    var ctx = this;
    var tag = ctx.element.isolateScope().dropdown.$scope.tag;
    expect(tag.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.toggleEdit(tag);
    expect(tag.showEdit).to.be.true;
    ctx.element.isolateScope().dropdown.$scope.noEdit(tag);
    expect(tag.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.noEdit(tag);
    expect(tag.showEdit).to.be.false;
  });

});
