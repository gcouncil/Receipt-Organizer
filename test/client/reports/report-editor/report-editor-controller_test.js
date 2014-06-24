var angular = require('angular');
var expect = require('chai').expect;

describe('report editor controller', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.reportStorage = {
      persist: ctx.sinon.stub()
    };

    ctx.itemStorage = {};

    angular.mock.module('ngMock', 'epsonreceipts.reports', {
      reportStorage: ctx.reportStorage
    });

    angular.mock.inject(function($rootScope, $q, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.scope.report = {
        items: []
      };

      ctx.scope.items = [
        { id: 1 },
        { id: 2 }
      ];

      ctx.deferred = $q.defer();
      ctx.serverPromise = $q.defer();

      ctx.reportEditorController = $controller('ReportEditorController', {
        $scope: ctx.scope,
        deferred: ctx.deferred,
        reportStorage: ctx.reportStorage,
        itemStorage: ctx.itemStorage,
        $stateParams: {}
      });
      ctx.scope.$digest();
    });
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('methods', function() {
    it('should remove items', function() {
      var ctx = this;
      ctx.scope.remove(ctx.scope.items[0]);
      expect(ctx.scope.items).to.deep.equal([ { id: 2 } ]);
    });

    it('should cancel', function() {
      var ctx = this;
      ctx.scope.cancel();
      ctx.scope.$digest();
      expect(ctx.deferred.promise).to.eventually.have.been.rejected;
    });

    it('should save', function() {
      var ctx = this;
      ctx.reportStorage.persist.returns(ctx.serverPromise.promise);
      ctx.scope.save();
      ctx.serverPromise.resolve();
      ctx.scope.$digest();
      expect(ctx.reportStorage.persist).to.have.been.calledWith(ctx.scope.report);
      expect(ctx.deferred).to.have.been.resolved;
    });

    it('should reject on server error', function() {
      var ctx = this;
      ctx.reportStorage.persist.returns(ctx.serverPromise.promise);
      ctx.scope.save();
      ctx.serverPromise.reject();
      ctx.scope.$digest();
      expect(ctx.reportStorage.persist).to.have.been.calledWith(ctx.scope.report);
      expect(ctx.deferred.promise).to.have.been.rejected;
    });

  });
});

