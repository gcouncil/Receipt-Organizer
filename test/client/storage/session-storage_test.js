var angular = require('angular');
var expect = require('chai').expect;

describe('session storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.currentUser = {
      set: ctx.sinon.stub()
    };

    ctx.domain = ctx.sinon.stub();

    angular.mock.module('epsonreceipts.storage', {
      currentUser: ctx.currentUser,
      domain: ctx.domain
    });
  });

  it('should confirm the users credentials and set the current user', function(done) {
    var ctx = this;
    angular.mock.inject(function($rootScope, $httpBackend, $q, sessionStorage) {
      $httpBackend.expectPOST(
        '/api/login',
        { username: 'test@example.com', password: 'password' }
      ).respond(200, 'USER');
      var result = sessionStorage.login('test@example.com', 'password');

      $httpBackend.flush();
      expect(result).to.eventually.equal('USER').and.notify(done);
      expect(ctx.currentUser.set).to.have.been.calledWith('USER');
      $rootScope.$digest();
    });
  });

  it('should reject bad credentials', function(done) {
    var ctx = this;
    angular.mock.inject(function($rootScope, $httpBackend, $q, sessionStorage) {
      $httpBackend.expectPOST(
        '/api/login',
        { username: 'test@example.com', password: 'password' }
      ).respond(401);
      var result = sessionStorage.login('test@example.com', 'password');

      $httpBackend.flush();
      expect(result).to.eventually.be.rejected.and.notify(done);
      expect(ctx.currentUser.set).not.to.have.been.calledWith('USER');
      $rootScope.$digest();
    });

  });

  it('should set the current user to null on logout', function(done) {
    var ctx = this;
    angular.mock.inject(function($rootScope, $q, sessionStorage) {
      var result = sessionStorage.logout();
      expect(result).to.be.fulfilled.and.notify(done);
      expect(ctx.currentUser.set).to.have.been.calledWith(null);
      $rootScope.$digest();
    });
  });
});
