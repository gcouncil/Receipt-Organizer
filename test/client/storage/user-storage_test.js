var angular = require('angular');
var expect = require('chai').expect;

describe('user storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      User: ctx.sinon.stub().returnsArg(0)
    };

    angular.mock.module('epsonreceipts.storage', {
      domain: ctx.domain
    });
  });

  describe('create', function() {
    it('should create the new user', function() {
      var ctx = this;
      ctx.user = { email: 'test@example.com', password: 'password' };

      angular.mock.inject(function($rootScope, $httpBackend, userStorage) {
        $httpBackend.expectPOST('/api/users').respond(200, ctx.user);

        var promise = userStorage.create(ctx.user);
        $httpBackend.flush();

        expect(promise).to.eventually.deep.equal(ctx.user);
        expect(ctx.domain.User).to.have.been.called.withNew;

        $rootScope.$digest();
      });
    });
  });

});
