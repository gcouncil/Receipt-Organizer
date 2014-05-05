var angular = require('angular');
var expect = require('chai').expect;

describe('authentication service', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.currentUser = {
      get: ctx.sinon.stub(),
      set: ctx.sinon.stub()
    };

    ctx.state = {
      go: ctx.sinon.stub()
    };

    angular.mock.module('epsonreceipts', {
      currentUser: ctx.currentUser,
      $state: ctx.state
    });

  });
  context('with a user', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.currentUser.get.returns({ token: 'TOKEN' });
    });

    it('should add an Authorization header with a bearer token', function() {
      angular.mock.inject(function($rootScope, $httpBackend, $http) {
        $httpBackend.expectGET('/', {
          Accept: 'application/json, text/plain, */*',
          Authorization: 'Bearer TOKEN'
        }).respond(200);

        $http.get('/');

        $httpBackend.flush();

        $rootScope.$digest();
      });
    });

    context('server error', function() {
      it('should set the currentUser to null', function() {
        var ctx = this;
        angular.mock.inject(function($rootScope, $httpBackend, $http) {
          $httpBackend.expectGET('/', {
            Accept: 'application/json, text/plain, */*',
            Authorization: 'Bearer TOKEN'
          }).respond(401);

          $http.get('/');

          $httpBackend.flush();
          expect(ctx.currentUser.set).to.have.been.calledWith(null);
          expect(ctx.state.go).to.have.been.called;

          $rootScope.$digest();
        });
      });
    });

  });

  context('without a user', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.currentUser.get.returns(false);
    });

    it('should not set the header', function() {
      angular.mock.inject(function($rootScope, $httpBackend, $http) {
        $httpBackend.expectGET('/', {
          Accept: 'application/json, text/plain, */*'
        }).respond(200);

        $http.get('/');

        $httpBackend.flush();

        $rootScope.$digest();

      });

    });
  });
});
