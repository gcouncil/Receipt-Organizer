var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('receipt drop zone directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.receiptStorage = {
      fetch: ctx.sinon.stub(),
      update: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.receipts.drop-zone', {
      receiptStorage: ctx.receiptStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<div receipt-drop-zone tag="tag"></div>')(ctx.scope);
        ctx.scope.tag = { name: 'tag1', id: 1 };
        ctx.deferred = $q.defer();
        ctx.receiptStorage.fetch.returns(ctx.deferred.promise);
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

  describe('drag events', function() {

    context('with valid types', function() {

      beforeEach(function() {
        var ctx = this;
        ctx.event = {
          dataTransfer: {
            types: ['application/json+receipt']
          },
          preventDefault: ctx.sinon.stub()
        };
      });


      context('dragenter', function() {
        beforeEach(function() {
          var ctx = this;

          var e = $.Event('dragenter', ctx.event);
          ctx.element.trigger(e);
        });

        it('should change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.true;
        });

        it('should add copy drop effect', function() {
          var ctx = this;
          expect(ctx.event.dataTransfer.dropEffect).to.equal('copy');
        });

        it('should prevent default', function() {
          var ctx = this;
          expect(ctx.event.preventDefault).to.have.been.called;
        });
      });

      context('dragover', function() {
        beforeEach(function() {
          var ctx = this;

          var e = $.Event('dragover', ctx.event);
          ctx.element.trigger(e);
        });

        it('should change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.true;
        });

        it('should add copy drop effect', function() {
          var ctx = this;
          expect(ctx.event.dataTransfer.dropEffect).to.equal('copy');
        });

        it('should prevent default', function() {
          var ctx = this;
          expect(ctx.event.preventDefault).to.have.been.called;
        });
      });

    });

    context('with invalid types', function() {

      beforeEach(function() {
        var ctx = this;
        ctx.event = {
          dataTransfer: {
            types: ['application/json+image']
          },
          preventDefault: ctx.sinon.stub()
        };
      });

      context('dragenter', function() {
        beforeEach(function() {
          var ctx = this;

          var e = $.Event('dragenter', ctx.event);
          ctx.element.trigger(e);
        });

        it('should change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.true;
        });

        it('should not add copy drop effect', function() {
          var ctx = this;
          expect(ctx.event.dataTransfer.dropEffect).to.be.undefined;
        });

        it('should not prevent default', function() {
          var ctx = this;
          expect(ctx.event.preventDefault).not.to.have.been.called;
        });
      });

      context('dragover', function() {
        beforeEach(function() {
          var ctx = this;

          var e = $.Event('dragover', ctx.event);
          ctx.element.trigger(e);
        });

        it('should change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.true;
        });

        it('should not add copy drop effect', function() {
          var ctx = this;
          expect(ctx.event.dataTransfer.dropEffect).to.be.undefined;
        });

        it('should not prevent default', function() {
          var ctx = this;
          expect(ctx.event.preventDefault).not.to.have.been.called;
        });
      });

    });

  });

  describe('drop events', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.data = JSON.stringify({
        type: 'receipt',
        id: 2
      });

      ctx.event = {
        dataTransfer: {
          types: ['application/json+receipt'],
          dropEffect: 'copy',
          getData: ctx.sinon.stub().returns(ctx.data)
        },
        preventDefault: ctx.sinon.stub()
      };


      ctx.deferred.resolve({
        tags: [],
        clone: function() {
          return angular.copy(this);
        }
      });
      var e = $.Event('drop', ctx.event);
      ctx.element.trigger(e);
    });

    it('should get the data from the event', function() {
      var ctx = this;
      expect(ctx.event.dataTransfer.getData).to.have.been.called;
    });

    it('should display duplicate message if there is no result', function() {
      var ctx = this;
      ctx.receiptStorage.update.returns();
      ctx.scope.$digest();
      expect(ctx.notify.error).to.have.been.calledWith('Receipt already tagged with tag1!');
    });

    it('should display success message if there is a result', function() {
      var ctx = this;
      ctx.receiptStorage.update.returns('RECEIPT');
      ctx.scope.$digest();
      expect(ctx.notify.success).to.have.been.calledWith('Added the tag1 tag to your receipt.');
    });
  });


});
