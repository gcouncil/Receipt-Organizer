var angular = require('angular');
var expect = require('chai').expect;

describe('item events', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Receipt: ctx.sinon.stub().returnsArg(0)
    };

    ctx.receiptEditor = ctx.sinon.stub();
    ctx.reportEditor = ctx.sinon.stub();
    ctx.confirmation = ctx.sinon.stub();
    ctx.pluralize = ctx.sinon.stub();

    var $q;

    ctx.itemStorage = {
      create: ctx.sinon.stub(),
      destroy: ctx.sinon.spy(function() {
        return $q.when(true);
      }),
      persist: ctx.sinon.stub(),
      markReviewed: ctx.sinon.stub(),
      fetchChildren: ctx.sinon.stub().returns([{ id: 2, type: 'expense' }])
    };

    ctx.imageStorage = {
      create: ctx.sinon.stub()
    };


    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    ctx.uuid = ctx.sinon.spy(function() {
      return $q.when('UUID');
    });

    angular.mock.module('ngMock', 'epsonreceipts.items', {
      domain: ctx.domain,
      receiptEditor: ctx.receiptEditor,
      itemStorage: ctx.itemStorage,
      imageStorage: ctx.imageStorage,
      confirmation: ctx.confirmation,
      notify: ctx.notify,
      reportEditor: ctx.reportEditor,
      uuid: ctx.uuid,
      erPluralize: ctx.pluralize
    });

    angular.mock.inject(function($rootScope, _$q_) {
      $q = _$q_;
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

  context('items:review', function(){
    it('should call the item storage review method when calling items:review', function() {
      var ctx = this;
      ctx.scope.$emit('items:review', ctx.items);
      expect(ctx.itemStorage.markReviewed).to.have.been.calledWith(ctx.items[0]);
      expect(ctx.itemStorage.markReviewed).to.have.been.calledWith(ctx.items[1]);
    });
  });

  context('items:destroy', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.confirmation.returns(ctx.deferred.promise);
    });

    it('should destroy one item', function() {
      var ctx = this;
      ctx.scope.$emit('items:destroy', { id: 1, type: 'receipt' });
      ctx.deferred.resolve();
      ctx.scope.$digest();
      expect(ctx.itemStorage.destroy).to.have.been.calledWith({ id: 1, type: 'receipt' });
    });

    it('should destroy multiple items', function() {
      var ctx = this;
      ctx.scope.$emit('items:destroy', [{id: 1, type: 'receipt'}, { id: 3, type: 'receipt' }]);
      ctx.deferred.resolve();
      ctx.scope.$digest();
      expect(ctx.itemStorage.destroy).to.have.been.calledWith({ id: 2, type: 'expense'});
      expect(ctx.itemStorage.destroy).to.have.been.calledWith({ id: 1, type: 'receipt'});
      expect(ctx.itemStorage.destroy).to.have.been.calledWith({ id: 3, type: 'receipt'});
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
        expect(ctx.itemStorage.create).to.have.been.calledWith({ images: [ctx.image.id] });
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
