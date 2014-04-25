var angular = require('angular');
var expect = require('chai').expect;

describe('notify service', function() {
  beforeEach(angular.mock.module('epsonreceipts.notify'));

  context('adding and removing notices', function() {

    it('should initialize with empty notices', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
      });
    });

    it('should add messages correctly', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
        notify.add('danger', 'DANGER WILL ROBINSON');
        var key = Object.keys(notify.notices)[0];
        expect(notify.notices[key]).to.deep.equal({
          message: 'DANGER WILL ROBINSON',
          type: 'danger'
        });
      });
    });

    it('should timeout', function() {
      angular.mock.inject(function(notify) {
        this.clock = this.sinon.useFakeTimers();
        notify.success('you succeeded');
        expect(Object.keys(notify.notices).length).to.equal(1);
        this.clock.tick(4001);
        expect(Object.keys(notify.notices).length).to.equal(0);
      });
    });

    it('should give back an object with a cancel function', function() {
      angular.mock.inject(function(notify) {
        notify.info('this is only a test').cancel();
        expect(Object.keys(notify.notices).length).to.equal(0);
      });
    });

  });

  context('convenience methods', function() {

    it('should add danger message with error()', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
        notify.error('peligro');
        var key = Object.keys(notify.notices)[0];
        expect(notify.notices[key]).to.deep.equal({
          message: 'peligro',
          type: 'danger'
        });
      });
    });

    it('should add success message with success()', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
        notify.error('you did it');
        var key = Object.keys(notify.notices)[0];
        expect(notify.notices[key]).to.deep.equal({
          message: 'you did it',
          type: 'danger'
        });
      });
    });

    it('should add info message with info()', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
        notify.error('let it be known');
        var key = Object.keys(notify.notices)[0];
        expect(notify.notices[key]).to.deep.equal({
          message: 'let it be known',
          type: 'danger'
        });
      });
    });

  });

  context('sad path', function() {

    it('should add nothing when passed bad data', function() {
      angular.mock.inject(function(notify, $timeout) {
        expect(Object.keys(notify.notices).length).to.equal(0);
        notify.success({});
        notify.success(1);
        notify.success(null);
        notify.success(undefined);
        notify.success([]);
        expect(Object.keys(notify.notices).length).to.equal(0);
      });
    });

  });

});
