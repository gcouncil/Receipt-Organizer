var angular = require('angular');
var expect = require('chai').expect;
var domain = require('epson-receipts/domain');

describe('current user service', function() {
  beforeEach(function() {
    angular.mock.module('epsonreceipts.storage', {});
  });

  afterEach(function() {
    /* global window */
    window.localStorage.removeItem('currentUser');
  });

  it('gets the current user from the localStorageService', function() {
    angular.mock.inject(function(currentUser) {
      expect(window.localStorage.getItem('currentUser')).to.equal(null);
    });
  });

  it('sets the current user in the localStorageService', function() {
    angular.mock.inject(function(currentUser) {
      var userData = { email: 'USER' };
      var user = (new domain.User(userData)).toJSON();
      currentUser.set(userData);
      expect(currentUser.get()).to.deep.equal(user);
    });
  });
});
