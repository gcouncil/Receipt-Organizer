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

  beforeEach(angular.mock.inject(function(confirmation) {
    this.confirmation = confirmation;
  }));

  it('responds by destroying the dialog upon receiving yes or no', function(done) {
    var ctx = this;

    var promise = this.confirmation({});
    ctx.modal.$scope.yes();

    expect(ctx.modal.destroy).to.have.been.called;
    promise.then(function() { done(); }, done);
  });

  it('responds with deferred.resolve on receiving a yes', function() {
  });

  it('responds with deferred.destroy on receiving a no', function() {
  });

});
