var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('expense drop zone directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.expenseStorage = {
      fetch: ctx.sinon.stub(),
      update: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.expenses.drop-zone', {
      expenseStorage: ctx.expenseStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<div expense-drop-zone tag="tag"></div>')(ctx.scope);
        ctx.scope.tag = { name: 'tag1', id: 1 };
        ctx.deferred = $q.defer();
        ctx.expenseStorage.fetch.returns(ctx.deferred.promise);
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
            types: ['application/json+expense']
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
          type: 'tag',
          id: 3
        });

        ctx.event = {
          dataTransfer: {
            types: ['application/json+expense'],
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

      it('should not add the tag the expense', function() {
        var ctx = this;
        expect(ctx.expenseStorage.fetch).not.to.have.been.called;
      });
    });

    context('with correct data type', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.data = JSON.stringify({
          type: 'expense',
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
      });

      context('with a duplicate', function() {
        beforeEach(function() {
          var ctx = this;
          ctx.deferred.resolve({
            tags: [1],
            clone: function() {
              return angular.copy(this);
            }
          });
          var e = $.Event('drop', ctx.event);
          ctx.element.trigger(e);
        });

        it('should not update the expense if there is a duplicate', function() {
          var ctx = this;
          ctx.scope.$digest();
          expect(ctx.expenseStorage.update).not.to.have.been.called;
        });

        it('should display duplicate message if there is no result', function() {
          var ctx = this;
          ctx.expenseStorage.update.returns();
          ctx.scope.$digest();
          expect(ctx.notify.error).to.have.been.calledWith('Expense already tagged with tag1!');
        });

      });

      context('without errors', function() {
        beforeEach(function() {
          var ctx = this;
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
          ctx.scope.$digest();
          expect(ctx.event.dataTransfer.getData).to.have.been.called;
        });

        it('should display success message if there is a result', function() {
          var ctx = this;
          ctx.expenseStorage.update.returns('EXPENSE');
          ctx.scope.$digest();
          expect(ctx.notify.success).to.have.been.calledWith('Added the tag1 tag to your expense.');
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
          expect(ctx.notify.error).to.have.been.calledWith('There was a problem adding tag1 tag to your expense.');
        });
      });
    });
  });
});
