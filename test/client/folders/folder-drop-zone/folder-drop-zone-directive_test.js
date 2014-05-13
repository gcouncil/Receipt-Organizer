var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('folder drop zone directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.itemStorage = {
      update: ctx.sinon.stub().returnsArg(0),
      fetch: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.folders', {
      itemStorage: ctx.itemStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $q, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<div folder-drop-zone expense="expense"></div>')(ctx.scope);
        ctx.scope.expense = {
          name: 'expense1',
          id: 1
        };
        ctx.deferred = $q.defer();
        ctx.itemStorage.fetch.returns(ctx.deferred.promise);
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
            types: ['application/json+folder']
          },
          preventDefault: ctx.sinon.stub()
        };
      });

      describe('dragenter', function() {

        beforeEach(function() {
          var ctx = this;
          var e = $.Event('dragenter', ctx.event);
          ctx.element.trigger(e);
        });

        it('should the drop-active class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.true;
        });

        it('should keep the drop-active class on subsiquent events', function() {
          var ctx = this;
          var e = $.Event('dragenter', ctx.event);
          ctx.element.trigger(e);
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

      describe('dragover', function() {

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

      describe('dragenter', function() {
        beforeEach(function() {
          var ctx = this;
          var e = $.Event('dragenter', ctx.event);
          ctx.element.trigger(e);
        });

        it('should not change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.false;
        });

        it('should not add copy drop effect', function() {
          var ctx = this;
          expect(ctx.event.dataTransfer.dropEffect).not.to.equal('copy');
        });

        it('should not prevent default', function() {
          var ctx = this;
          expect(ctx.event.preventDefault).not.to.have.been.called;
        });

      });

      describe('dragover', function() {
        beforeEach(function() {
          var ctx = this;
          var e = $.Event('dragover', ctx.event);
          ctx.element.trigger(e);
        });

        it('should not change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.false;
        });

        it('should not add copy drop effect', function() {
          var ctx = this;
          expect(ctx.event.dataTransfer.dropEffect).not.to.equal('copy');
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
        name: 'folder1',
        type: 'folder',
        id: 2
      });

      ctx.event = {
        dataTransfer: {
          types: ['application/json+expense'],
          dropEffect: 'copy',
          getData: ctx.sinon.stub().returns(ctx.data)
        },
        preventDefault: ctx.sinon.stub()
      };

      var e = $.Event('drop', ctx.event);
      ctx.element.trigger(e);
    });

    it('should get the data from the event', function() {
      var ctx = this;
      expect(ctx.event.dataTransfer.getData).to.have.been.called;
    });

    it('should display duplicate message if there is no result', function() {
      var ctx = this;
      ctx.deferred.reject();
      ctx.itemStorage.update.returns(null);
      ctx.scope.$digest();
      expect(ctx.notify.error).to.have.been.called;
    });

    it('should display success message if there is a result', function() {
      var ctx = this;
      ctx.deferred.resolve({
        folders: [],
        addFolder: ctx.sinon.stub().returns(true),
        clone: function() {
          return angular.copy(this);
        }
      });

      ctx.itemStorage.update.returns('EXPENSE');
      ctx.scope.$digest();
      expect(ctx.notify.success).to.have.been.called;
    });

    it('should display an error if the folder is a duplicate', function() {
      var ctx = this;
      ctx.deferred.resolve({
        folders: [],
        addFolder: ctx.sinon.stub().returns(false),
        clone: function() {
          return angular.copy(this);
        }
      });

      ctx.scope.$digest();
      expect(ctx.notify.error).to.have.been.called;
    });
  });
});

