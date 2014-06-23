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

  context('when skipping authorization', function() {
    beforeEach(function() {
      var ctx = this;
      angular.mock.module('epsonreceipts', {
        currentUser: ctx.currentUser,
        $state: ctx.state,
        skipAuthorization: true
      });
    });

    it('should not set the Authorization header', function() {
      angular.mock.inject(function($rootScope, $httpBackend, $http) {
        $httpBackend.expectGET('/', {
          Accept: 'application/json, text/plain, */*',
          'If-Modified-Since': '0'
        }).respond(200);

        $http.get('/');

        $httpBackend.flush();

        $rootScope.$digest();
      });

    });
  });

  context('with a user', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.currentUser.get.returns({ token: 'TOKEN' });

      angular.mock.inject(function($httpBackend) {
        $httpBackend.whenGET('/api/items').respond(200, []);
      });
    });

    it('should add an Authorization header with a bearer token', function() {
      angular.mock.inject(function($rootScope, $httpBackend, $http) {
        $httpBackend.expectGET('/', {
          Accept: 'application/json, text/plain, */*',
          Authorization: 'Bearer TOKEN',
          'If-Modified-Since': '0'
        }).respond(200);

        $http.get('/');

        $httpBackend.flush();

        $rootScope.$digest();
      });
    });

    context('server error', function() {
      it('should set the currentUser to null and redirect to login', function() {
        var ctx = this;
        angular.mock.inject(function($rootScope, $httpBackend, $http) {
          $httpBackend.expectGET('/', {
            Accept: 'application/json, text/plain, */*',
            Authorization: 'Bearer TOKEN',
            'If-Modified-Since': '0'
          }).respond(401);

          $http.get('/');

          $httpBackend.flush();
          expect(ctx.currentUser.set).to.have.been.calledWith(null);
          expect(ctx.state.go).to.have.been.called;

          $rootScope.$digest();
        });
      });

      it('should not reset the user or redirect if not a 401', function() {
        // TODO: Figure out how we should handle server errors that are not 401
        var ctx = this;
        angular.mock.inject(function($rootScope, $httpBackend, $http) {
          $httpBackend.expectGET('/', {
            Accept: 'application/json, text/plain, */*',
            Authorization: 'Bearer TOKEN',
            'If-Modified-Since': '0'
          }).respond(404);

          $http.get('/');

          $httpBackend.flush();
          expect(ctx.currentUser.set).not.to.have.been.calledWith(null);
          expect(ctx.state.go).not.to.have.been.called;

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
          Accept: 'application/json, text/plain, */*',
          'If-Modified-Since': '0'
        }).respond(200);

        $http.get('/');

        $httpBackend.flush();

        $rootScope.$digest();

      });

    });
  });
});
