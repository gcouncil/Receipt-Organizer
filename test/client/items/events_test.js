var angular = require('angular');
var expect = require('chai').expect;

describe('item events', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Receipt: ctx.sinon.stub().returnsArg(0)
    };

    ctx.receiptEditor = ctx.sinon.stub();

    ctx.itemStorage = {
      create: ctx.sinon.stub(),
      destroy: ctx.sinon.stub(),
      persist: ctx.sinon.stub()
    };

    ctx.imageStorage = {
      create: ctx.sinon.stub()
    };

    ctx.reportEditor = ctx.sinon.stub();

    ctx.confirmation = ctx.sinon.stub();

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.items', {
      domain: ctx.domain,
      receiptEditor: ctx.receiptEditor,
      itemStorage: ctx.itemStorage,
      imageStorage: ctx.imageStorage,
      confirmation: ctx.confirmation,
      notify: ctx.notify,
      reportEditor: ctx.reportEditor
    });

    angular.mock.inject(function($rootScope, $q) {
      ctx.scope = $rootScope.$new();
      ctx.deferred = $q.defer();
      ctx.deferred2 = $q.defer();
      ctx.items = ['ITEM1', 'ITEM2'];
    });
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  context('items:edit', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.scope.$emit('items:edit', ctx.items);
      ctx.scope.$digest();
    });

    it('should launch the receipt editor on items:edit', function() {
      var ctx = this;
      expect(ctx.receiptEditor).to.have.been.calledWith(ctx.items);
    });
  });

  context('items:destroy', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.confirmation.returns(ctx.deferred.promise);
    });

    it('should destroy one item', function() {
      var ctx = this;
      ctx.scope.$emit('items:destroy', ctx.items[0]);
      ctx.deferred.resolve();
      ctx.scope.$digest();
      expect(ctx.confirmation).to.have.been.calledWith({
        count: 1,
        yes: 'Delete',
        when: {
          one: 'Are you sure you want to delete this item?',
          other: 'Are you sure you want to delete these {} items?'
        },
        no: 'Cancel'
      });
      expect(ctx.itemStorage.destroy).to.have.been.calledWith('ITEM1');
    });

    it('should destroy multiple items', function() {
      var ctx = this;
      ctx.scope.$emit('items:destroy', ctx.items);
      ctx.deferred.resolve();
      ctx.scope.$digest();
      expect(ctx.confirmation).to.have.been.calledWith({
        count: 2,
        yes: 'Delete',
        when: {
          one: 'Are you sure you want to delete this item?',
          other: 'Are you sure you want to delete these {} items?'
        },
        no: 'Cancel'
      });
      expect(ctx.itemStorage.destroy).to.have.been.calledWith('ITEM1');
      expect(ctx.itemStorage.destroy).to.have.been.calledWith('ITEM2');
    });
  });

  context('items:new', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.scope.$emit('items:new');
      ctx.scope.$digest();
    });

    it('should create a new item', function() {
      var ctx = this;
      expect(ctx.domain.Receipt).to.have.been.called.withNew;
      expect(ctx.receiptEditor).to.have.been.called;
    });
  });

  context('items:newimages', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.blobs = [
        {name: 'BLOB1', type: 'image/jpeg' },
        {name: 'BLOB2', type: 'image/png' },
        {name: 'BLOB3', type: 'image/gif' }
      ];
      ctx.image = { name: 'IMAGE', id: 1 };
      ctx.imageStorage.create.returns(ctx.deferred2.promise);
    });

    context('success', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.deferred2.resolve(ctx.image);
        ctx.scope.$emit('items:newimages', ctx.blobs);
        ctx.scope.$digest();
      });

      it('should add valid images', function() {
        var ctx = this;
        expect(ctx.imageStorage.create).to.have.been.calledWith(ctx.blobs[0]);
        expect(ctx.imageStorage.create).to.have.been.calledWith(ctx.blobs[1]);
        expect(ctx.itemStorage.create).to.have.been.calledWith({ image: ctx.image.id });
        expect(ctx.notify.success).to.have.been.calledWith('2 Image(s) added');
      });

      it('should not add invalid images', function() {
        var ctx = this;
        expect(ctx.imageStorage.create).not.to.have.been.calledWith(ctx.blobs[2]);
      });
    });

    it('should display errors', function() {
      var ctx = this;
      ctx.deferred2.reject('ERROR');
      ctx.scope.$emit('items:newimages', ctx.blobs);
      ctx.scope.$digest();
      expect(ctx.imageStorage.create).to.have.been.calledWith(ctx.blobs[0]);
      expect(ctx.notify.error).to.have.been.calledWith('Error while importing images');
    });
  });
});
