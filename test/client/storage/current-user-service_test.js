var angular = require('angular');
var expect = require('chai').expect;

describe('current user service', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.localStorageService = {
      get: ctx.sinon.stub(),
      add: ctx.sinon.stub()
    };

    angular.mock.module('epsonreceipts.storage', {
      localStorageService: ctx.localStorageService
    });

  });

  it('gets the current user from the localStorageService', function() {
    var ctx = this;
    angular.mock.inject(function(currentUser) {
      expect(ctx.localStorageService.get).to.have.been.called;
    });
  });

  it('sets the current user in the localStorageService', function() {
    var ctx = this;
    angular.mock.inject(function(currentUser) {
      currentUser.set('USER');
      expect(ctx.localStorageService.add).to.have.been.calledWith('currentUser', 'USER');
    });
  });
});
