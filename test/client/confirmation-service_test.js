var angular = require('angular');
var expect = require('chai').expect;

describe('Confirmation', function() {
  beforeEach(angular.mock.module('epsonreceipts.confirmation'));
  beforeEach(function() {
    var ctx = this;
    angular.mock.module({
      $modal: function() {
        ctx.modal = {
          $scope: {},
          destroy: ctx.sinon.stub()
        };
        return ctx.modal;
      }
    });
  });

  it('responds by destroying the dialog upon receiving yes', function(done) {
    var ctx = this;
    angular.mock.inject(function(confirmation, $rootScope) {
      var promise = confirmation({});
      ctx.modal.$scope.yes();

      expect(ctx.modal.destroy).to.have.been.called;
      expect(promise).notify(done);

      $rootScope.$digest();
    });
  });

  it('responds by destroying the dialog upon receiving no', function(done) {
    var ctx = this;
    angular.mock.inject(function(confirmation, $rootScope) {
      var promise = confirmation({});
      ctx.modal.$scope.no();

      expect(ctx.modal.destroy).to.have.been.called;
      expect(promise).notify(done);

      $rootScope.$digest();
    });
  });

  it('responds with deferred.resolve on receiving a yes', function(done) {
    var ctx = this;
    angular.mock.inject(function(confirmation, $rootScope) {
      var promise = confirmation({});
      ctx.modal.$scope.yes();

      expect(promise).to.be.fulfilled.and.notify(done);

      $rootScope.$digest();
    });
  });

  it('responds with deferred.destroy on receiving a no', function(done) {
    var ctx = this;
    angular.mock.inject(function(confirmation, $rootScope) {
      var promise = confirmation({});
      ctx.modal.$scope.no();

      expect(promise).to.be.rejected.and.notify(done);

      $rootScope.$digest();
    });
  });

});
