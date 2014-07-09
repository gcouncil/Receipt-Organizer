var angular = require('angular');
var expect = require('chai').expect;

describe('load image directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.imageStorage = {
      fetch: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.storage', {
      imageStorage: ctx.imageStorage
    });

    angular.mock.inject(function($rootScope, $q, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.scope.index = 0;
      ctx.scope.item = {
        images: []
      };
      ctx.deferred = $q.defer();

      ctx.element = $compile('<div load-image index="{{ index }}"/>')(ctx.scope);
      ctx.scope.$digest();
    });
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('initialization', function() {
    it('should start with loading false', function() {
      var ctx = this;
      expect(ctx.scope.imageLoader.loading).to.be.false;
    });

    it('should have a promise', function() {
      var ctx = this;
      expect(ctx.scope.imageLoader.promise).to.be.rejected;
    });
  });

  describe('item image change events', function() {
    context('when invalid', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.imageStorage.fetch.returns(ctx.deferred.promise);
        ctx.scope.item.images = [];
        ctx.scope.$digest();
      });

      it('should set loading to false', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.loading).to.be.false;
      });

      it('should set missing to true', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.missing).to.be.true;
      });

      it('should not set an error', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.error).to.be.undefined;
      });

      it('should not have an image yet', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.image).to.be.undefined;
      });

    });

    context('when valid', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.imageStorage.fetch.returns(ctx.deferred.promise);
        ctx.scope.item.images = ['IMAGE'];
        ctx.scope.$digest();
      });

      it('should set loading to true', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.loading).to.be.true;
      });

      it('should set missing to false', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.missing).to.be.false;
      });

      it('should not set an error', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.error).to.be.undefined;
      });

      it('should not have an image yet', function() {
        var ctx = this;
        expect(ctx.scope.imageLoader.image).to.be.undefined;
      });

      context('after server response', function() {
        describe('error fetching image', function() {
          beforeEach(function() {
            var ctx = this;
            ctx.deferred.reject(new Error('FAIL'));
            ctx.scope.$digest();
          });

          it('should set loading to false', function() {
            var ctx = this;
            expect(ctx.scope.imageLoader.loading).to.be.false;
          });

          it('should set missing to false', function() {
            var ctx = this;
            expect(ctx.scope.imageLoader.missing).to.be.false;
          });

          it('should not have an image yet', function() {
            var ctx = this;
            expect(ctx.scope.imageLoader.image).to.be.undefined;
          });

          it('should give back the error', function() {
            var ctx = this;
            expect(ctx.scope.imageLoader.error).to.be.an.instanceof(Error);
          });
        });

        describe('successful server response', function() {
          /* globals window:true */
          beforeEach(function() {
            var ctx = this;
            ctx.blob = 'IMAGE';
            window.URL = window.URL || { createObjectURL: function() {} };
            ctx.sinon.stub(window.URL, 'createObjectURL').returns('BLOB URL');
            ctx.deferred.resolve(ctx.blob);
            ctx.scope.$digest();
          });

          it('should set loading to false', function() {
            var ctx = this;
            expect(ctx.scope.imageLoader.loading).to.be.false;
          });

          it('should set missing to false', function() {
            var ctx = this;
            expect(ctx.scope.imageLoader.missing).to.be.false;
          });

          it('should give back the image', function() {
            var ctx = this;

            expect(ctx.scope.imageLoader.image.blob).to.equal(ctx.blob);
          });

          it('should not have an error', function() {
            var ctx = this;
            expect(ctx.scope.imageLoader.error).to.be.undefined;
          });
        });
      });
    });
  });
});

