var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('image drop zone directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.imageStorage = {
      create: ctx.sinon.stub()
    };

    ctx.itemStorage = {
      create: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.images', {
      imageStorage: ctx.imageStorage,
      itemStorage: ctx.itemStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<div image-drop-zone></div>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.imageDeferred = $q.defer();
      ctx.itemDeferred = $q.defer();
      ctx.imageStorage.create.returns(ctx.imageDeferred.promise);
      ctx.itemStorage.create.returns(ctx.itemDeferred.promise);
    });

    ctx.compile();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('dragenter dragover behavior', function() {

    beforeEach(function() {
      var ctx = this;
      ctx.typesEvent1 = {
        dataTransfer: {
          types: ['image/jpeg']
        },
        preventDefault: ctx.sinon.stub()
      };

      ctx.typesEvent2 = {
        dataTransfer: {
          types: ['Files']
        },
        preventDefault: ctx.sinon.stub()
      };

      ctx.filesEvent = {
        dataTransfer: {
          types: [],
          files: [ { type: 'image/jpeg' } ]
        },
        preventDefault: ctx.sinon.stub()
      };

      ctx.itemsEvent = {
        dataTransfer: {
          types: [],
          items: [ { type: 'image/jpeg' } ]
        },
        preventDefault: ctx.sinon.stub()
      };

      ctx.errorEvent = {
        dataTransfer: {
          types: [],
          items: []
        },
        preventDefault: ctx.sinon.stub()
      };
    });

    context('with errors', function() {
      it('dragover should not work if the types are wrong', function() {
        var ctx = this;
        var e = $.Event('dragover', ctx.errorEvent);
        $(ctx.element).trigger(e);
        expect(ctx.errorEvent.dataTransfer.dropEffect).to.be.undefined;
        expect(ctx.errorEvent.preventDefault).not.to.have.been.called;
      });

      it('dragenter should not work if the types are wrong', function() {
        var ctx = this;
        var e = $.Event('dragenter', ctx.errorEvent);
        $(ctx.element).trigger(e);
        expect(ctx.errorEvent.dataTransfer.dropEffect).to.be.undefined;
        expect(ctx.errorEvent.preventDefault).not.to.have.been.called;
      });

    });

    context('setting dropeffect and preventDefault on dragenter', function() {
      it('should work with a types event', function() {
        var ctx = this;
        var e = $.Event('dragenter', ctx.typesEvent1);
        $(ctx.element).trigger(e);
        expect(ctx.typesEvent1.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.typesEvent1.preventDefault).to.have.been.called;
      });

      it('should work with another kind of types event', function() {
        var ctx = this;
        var e = $.Event('dragenter', ctx.typesEvent2);
        $(ctx.element).trigger(e);
        expect(ctx.typesEvent2.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.typesEvent2.preventDefault).to.have.been.called;
      });


      it('should work with a files event', function() {
        var ctx = this;
        var e = $.Event('dragenter', ctx.filesEvent);
        $(ctx.element).trigger(e);
        expect(ctx.filesEvent.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.filesEvent.preventDefault).to.have.been.called;
      });

      it('should work with an items event', function() {
        var ctx = this;
        var e = $.Event('dragenter', ctx.itemsEvent);
        $(ctx.element).trigger(e);
        expect(ctx.itemsEvent.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.itemsEvent.preventDefault).to.have.been.called;
      });
    });

    context('setting dropeffect and preventDefault on dragover', function() {
      it('should work with a types event', function() {
        var ctx = this;
        var e = $.Event('dragover', ctx.typesEvent1);
        $(ctx.element).trigger(e);
        expect(ctx.typesEvent1.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.typesEvent1.preventDefault).to.have.been.called;
      });

      it('should work with another kind of types event', function() {
        var ctx = this;
        var e = $.Event('dragover', ctx.typesEvent2);
        $(ctx.element).trigger(e);
        expect(ctx.typesEvent2.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.typesEvent2.preventDefault).to.have.been.called;
      });


      it('should work with a files event', function() {
        var ctx = this;
        var e = $.Event('dragover', ctx.filesEvent);
        $(ctx.element).trigger(e);
        expect(ctx.filesEvent.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.filesEvent.preventDefault).to.have.been.called;
      });

      it('should work with an items event', function() {
        var ctx = this;
        var e = $.Event('dragover', ctx.itemsEvent);
        $(ctx.element).trigger(e);
        expect(ctx.itemsEvent.dataTransfer.dropEffect).to.equal('copy');
        expect(ctx.itemsEvent.preventDefault).to.have.been.called;
      });
    });

  });

  describe('drop event behavior', function() {

    context('with errors', function() {
      it('should not prevent default if there are not items or files', function() {
        var ctx = this;
        ctx.event = {
          dataTransfer: {
            types: ['image/jpeg'],
            items: []
          },
          preventDefault: ctx.sinon.stub()
        };

        var e = $.Event('drop', ctx.event);
        $(ctx.element).trigger(e);
        expect(ctx.event.preventDefault).not.to.have.been.called;
      });

      it('should not prevent default if there are not jpeg items or files', function() {
        var ctx = this;
        ctx.event = {
          dataTransfer: {
            types: ['image/jpeg'],
            items: [ {type: 'image/gif'}, {type: 'audio/mp3'}]
          },
          preventDefault: ctx.sinon.stub()
        };

        var e = $.Event('drop', ctx.event);
        $(ctx.element).trigger(e);
        expect(ctx.event.preventDefault).not.to.have.been.called;
      });

      it('should not create the images if there are not files', function() {
        var ctx = this;
        ctx.event = {
          dataTransfer: {
            types: [],
            items: []
          },
          preventDefault: ctx.sinon.stub()
        };

        var e = $.Event('drop', ctx.event);
        $(ctx.element).trigger(e);
        expect(ctx.imageStorage.create).not.to.have.been.called;
      });
    });

    context('with jpeg items', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.getAsFile = ctx.sinon.stub().returns('FILE');
        ctx.event = {
          dataTransfer: {
            types: ['image/jpeg'],
            items: [ {type: 'image/jpeg', getAsFile: ctx.getAsFile} ]
          },
          preventDefault: ctx.sinon.stub()
        };

        var e = $.Event('drop', ctx.event);
        $(ctx.element).trigger(e);
      });

      it('should prevent default', function() {
        var ctx = this;
        expect(ctx.event.preventDefault).to.have.been.called;
      });

      it('should getAsFile', function() {
        var ctx = this;
        expect(ctx.getAsFile).to.have.been.called;
      });

      it('should create a new image', function() {
        var ctx = this;
        ctx.imageDeferred.resolve({ id: 'ID' });
        ctx.scope.$digest();
        expect(ctx.imageStorage.create).to.have.been.called;
      });

      it('should create a new item', function() {
        var ctx = this;
        ctx.imageDeferred.resolve({ id: 'ID' });
        ctx.scope.$digest();
        expect(ctx.itemStorage.create).to.have.been.called;
      });

      it('should notify the user of created item', function() {
        var ctx = this;
        ctx.imageDeferred.resolve({ id: 'ID' });
        ctx.itemDeferred.resolve(['EXPENSE']);
        ctx.scope.$digest();
        expect(ctx.notify.success).to.have.been.calledWith('Created 1 new items');
      });

      it('should display error message if there is a server error', function() {
        var ctx = this;
        ctx.imageDeferred.reject();
        ctx.itemDeferred.reject();
        ctx.scope.$digest();
        expect(ctx.notify.error).to.have.been.calledWith('An error occurred while adding items');
      });

    });

    context('with jpeg files', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.event = {
          dataTransfer: {
            types: ['image/jpeg'],
            files: [ {type: 'image/jpeg'} ]
          },
          preventDefault: ctx.sinon.stub()
        };

        var e = $.Event('drop', ctx.event);
        $(ctx.element).trigger(e);
      });

      it('should prevent default', function() {
        var ctx = this;
        expect(ctx.event.preventDefault).to.have.been.called;
      });

      it('should create a new image', function() {
        var ctx = this;
        ctx.imageDeferred.resolve({ id: 'ID' });
        ctx.scope.$digest();
        expect(ctx.imageStorage.create).to.have.been.called;
      });

      it('should create a new item', function() {
        var ctx = this;
        ctx.imageDeferred.resolve({ id: 'ID' });
        ctx.scope.$digest();
        expect(ctx.itemStorage.create).to.have.been.called;
      });

      it('should notify the user of created item', function() {
        var ctx = this;
        ctx.imageDeferred.resolve({ id: 'ID' });
        ctx.itemDeferred.resolve(['EXPENSE']);
        ctx.scope.$digest();
        expect(ctx.notify.success).to.have.been.calledWith('Created 1 new items');
      });

      it('should display error message if there is a server error', function() {
        var ctx = this;
        ctx.imageDeferred.reject();
        ctx.itemDeferred.reject();
        ctx.scope.$digest();
        expect(ctx.notify.error).to.have.been.calledWith('An error occurred while adding items');
      });
    });
  });
});
