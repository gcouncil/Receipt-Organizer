var angular = require('angular');
var expect = require('chai').expect;
var _ = require('lodash');

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
        expect(_.values(notify.notices)[0]).to.deep.equal({
          message: 'DANGER WILL ROBINSON',
          type: 'danger'
        });
      });
    });

    it('should timeout', function() {
      angular.mock.inject(function(notify) {
        this.clock = this.sinon.useFakeTimers();
        notify.success('you succeeded');
        expect(_.size(notify.notices)).to.equal(1);
        this.clock.tick(4001);
        expect(_.size(notify.notices)).to.equal(0);
      });
    });

    it('should give back an object with a cancel function', function() {
      angular.mock.inject(function(notify) {
        notify.info('this is only a test').cancel();
        expect(_.size(notify.notices)).to.equal(0);
      });
    });

  });

  context('convenience methods', function() {

    it('should add danger message with error()', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
        notify.error('peligro');
        expect(_.values(notify.notices)[0]).to.deep.equal({
          message: 'peligro',
          type: 'danger'
        });
      });
    });

    it('should add success message with success()', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
        notify.success('you did it');
        expect(_.values(notify.notices)[0]).to.deep.equal({
          message: 'you did it',
          type: 'success'
        });
      });
    });

    it('should add info message with info()', function() {
      angular.mock.inject(function(notify) {
        expect(notify.notices).to.deep.equal({});
        notify.info('let it be known');
        expect(_.values(notify.notices)[0]).to.deep.equal({
          message: 'let it be known',
          type: 'info'
        });
      });
    });

  });

});