var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('item drop zone directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.itemStorage = {
      fetch: ctx.sinon.stub(),
      update: ctx.sinon.stub()
    };

    ctx.reportStorage = {
      fetch: ctx.sinon.stub(),
      update: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    function Folder() {}
    function Report() {}

    angular.mock.module('ngMock', 'epsonreceipts.items.drop-zone', {
      itemStorage: ctx.itemStorage,
      reportStorage: ctx.reportStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $q) {
      ctx.scope = $rootScope.$new();
      ctx.reportScope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<div item-drop-zone folder="folder"></div>')(ctx.scope);
        ctx.reportElement = $compile('<div item-drop-zone report="report"></div>')(ctx.reportScope);
        ctx.scope.folder = { name: 'folder1', id: 1 };
        ctx.reportScope.report = { name: 'report1', id: 2 };
        ctx.scope.folder.constructor = Folder;
        ctx.reportScope.report.constructor = Report;
        ctx.deferred = $q.defer();
        ctx.reportDeferred = $q.defer();
        ctx.itemStorage.fetch.returns(ctx.deferred.promise);
        ctx.reportStorage.fetch.returns(ctx.reportDeferred.promise);
        ctx.scope.$digest();
        ctx.reportScope.$digest();
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
            types: ['application/json+item']
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

      describe('dragenter', function() {
        beforeEach(function() {
          var ctx = this;

          var e = $.Event('dragenter', ctx.event);
          ctx.element.trigger(e);
        });

        it('should not change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).not.to.be.true;
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

      describe('dragover', function() {
        beforeEach(function() {
          var ctx = this;
          var e = $.Event('dragover', ctx.event);
          ctx.element.trigger(e);
        });

        it('should not change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).not.to.be.true;
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
    context('with the wrong type of data', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.data = JSON.stringify({
          type: 'folder',
          id: 3
        });

        ctx.event = {
          dataTransfer: {
            types: ['application/json+image'],
            dropEffect: 'copy',
            getData: ctx.sinon.stub().returns(ctx.data)
          },
          preventDefault: ctx.sinon.stub()
        };

        ctx.deferred.resolve({
          folders: [],
          clone: function() {
            return angular.copy(this);
          }
        });

        var e = $.Event('drop', ctx.event);
        ctx.element.trigger(e);
        ctx.reportElement.trigger(e);
      });

      it('should not add the folder the item', function() {
        var ctx = this;
        expect(ctx.itemStorage.fetch).not.to.have.been.called;
        expect(ctx.itemStorage.update).not.to.have.been.called;
      });

      it('should not add the item to the report', function() {
        var ctx = this;
        expect(ctx.reportStorage.update).not.to.have.been.called;
      });
    });

    context('with correct data type', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.data = JSON.stringify({
          type: 'item',
          id: 2
        });
        ctx.event = {
          dataTransfer: {
            types: ['application/json+item'],
            dropEffect: 'copy',
            getData: ctx.sinon.stub().returns(ctx.data)
          },
          preventDefault: ctx.sinon.stub()
        };
      });

      context('adding to report', function() {
        context('with a duplicate', function() {
          beforeEach(function() {
            var ctx = this;
            ctx.reportDeferred.resolve({
              items: [2],
              clone: function() {
                return angular.copy(this);
              }
            });
            var e = $.Event('drop', ctx.event);
            ctx.reportElement.trigger(e);
          });

          it('should not update the item if there is a duplicate', function() {
            var ctx = this;
            ctx.reportScope.$digest();
            expect(ctx.reportStorage.update).not.to.have.been.called;
          });

          it('should display duplicate message if there is no result', function() {
            var ctx = this;
            ctx.reportStorage.update.returns();
            ctx.reportScope.$digest();
            expect(ctx.notify.error).to.have.been.calledWith('Item already in the report1 report!');
          });
        });

        context('without errors', function() {
          beforeEach(function() {
            var ctx = this;
            ctx.reportDeferred.resolve({
              items: [],
              clone: function() {
                return angular.copy(this);
              }
            });
            var e = $.Event('drop', ctx.event);
            ctx.reportElement.trigger(e);
          });

          it('should get the data from the event', function() {
            var ctx = this;
            ctx.reportScope.$digest();
            expect(ctx.event.dataTransfer.getData).to.have.been.called;
          });

          it('should display success message if there is a result', function() {
            var ctx = this;
            ctx.reportStorage.update.returns('REPORT');
            ctx.reportScope.$digest();
            expect(ctx.notify.success).to.have.been.calledWith('Added your item to the report1 report.');
          });
        });

        context('with errors', function() {
          beforeEach(function() {
            var ctx = this;
            ctx.reportDeferred.reject();
            var e = $.Event('drop', ctx.event);
            ctx.reportElement.trigger(e);
          });

          it('should display errors', function() {
            var ctx = this;
            ctx.reportScope.$digest();
            expect(ctx.notify.error).to.have.been.calledWith('There was a problem adding your item to the report1 report.');
          });
        });

      });

      context('adding to folder', function() {
        context('with a duplicate', function() {
          beforeEach(function() {
            var ctx = this;
            ctx.deferred.resolve({
              folders: [1],
              clone: function() {
                return angular.copy(this);
              }
            });
            var e = $.Event('drop', ctx.event);
            ctx.element.trigger(e);
          });

          it('should not update the item if there is a duplicate', function() {
            var ctx = this;
            ctx.scope.$digest();
            expect(ctx.itemStorage.update).not.to.have.been.called;
          });

          it('should display duplicate message if there is no result', function() {
            var ctx = this;
            ctx.itemStorage.update.returns();
            ctx.scope.$digest();
            expect(ctx.notify.error).to.have.been.calledWith('Item already in the folder1 folder!');
          });

        });

        context('without errors', function() {
          beforeEach(function() {
            var ctx = this;
            ctx.deferred.resolve({
              folders: [],
              clone: function() {
                return angular.copy(this);
              }
            });
            var e = $.Event('drop', ctx.event);
            ctx.element.trigger(e);
          });

          it('should get the data from the event', function() {
            var ctx = this;
            ctx.scope.$digest();
            expect(ctx.event.dataTransfer.getData).to.have.been.called;
          });

          it('should display success message if there is a result', function() {
            var ctx = this;
            ctx.itemStorage.update.returns('EXPENSE');
            ctx.scope.$digest();
            expect(ctx.notify.success).to.have.been.calledWith('Added your item to the folder1 folder.');
          });
        });

        context('with errors', function() {
          beforeEach(function() {
            var ctx = this;
            ctx.deferred.reject();
            var e = $.Event('drop', ctx.event);
            ctx.element.trigger(e);
          });

          it('should display errors', function() {
            var ctx = this;
            ctx.scope.$digest();
            expect(ctx.notify.error).to.have.been.calledWith('There was a problem adding your item to the folder1 folder.');
          });
        });
      });
    });
  });
});
