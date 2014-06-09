var angular = require('angular');
var expect = require('chai').expect;
var _ = require('lodash');

describe('user settings directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.notify = {
      success: ctx.sinon.stub(),
      info: ctx.sinon.stub()
    };

    ctx.state = {
      $current: {
        name: 'CURRENT.PAGE'
      },
      href: ctx.sinon.stub(),
      get: ctx.sinon.stub(),
      go: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.users.settings', {
      notify: ctx.notify,
      $state: ctx.state
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<user-settings></user-settings>')(ctx.scope);
        ctx.scope.$digest();
      };
    });

    ctx.compile();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  context('setup', function() {
    it('gets the suffix of the current state name', function() {
      var ctx = this;
      expect(ctx.scope.currentPage).to.equal('PAGE');
    });

    it('checks the current page', function() {
      var ctx = this;
      expect(ctx.scope.isCurrentPage('PAGE')).to.be.true;
      expect(ctx.scope.isCurrentPage('MCGUFFIN')).to.be.false;
    });
  });

  context('form completion', function() {
    it('saves the preferences', function() {
      var ctx = this;
      ctx.scope.save();
      expect(ctx.notify.success).to.have.been.calledWith('Saved your PAGE preferences.');
    });

    it('cancels preference save', function() {
      var ctx = this;
      ctx.scope.cancel();
      expect(ctx.notify.info).to.have.been.calledWith('Your changes were cancelled.');
      expect(ctx.state.go).to.have.been.calledWith('items');
    });
  });

  context('categories', function() {
    it('sets the defualt categories', function() {
      var ctx = this;
      expect(ctx.scope.categories[0]).to.equal('Airline');
      expect(ctx.scope.categories.length).to.equal(15);
    });

    it('deletes', function() {
      var ctx = this;
      expect(_.contains(ctx.scope.categories, 'Airline')).to.be.true;
      ctx.scope.delete('categories', 'Airline');
      ctx.scope.$digest();
      expect(_.contains(ctx.scope.categories, 'Airline')).to.be.false;
      expect(ctx.notify.success).to.have.been.calledWith('Deleted the Airline category.');
    });
  });

  context('form fields', function() {
    it('sets the defualt fields', function() {
      var ctx = this;
      expect(ctx.scope.fields[0]).to.equal('Custom Field 1');
      expect(ctx.scope.fields.length).to.equal(5);
    });

    it('deletes', function() {
      var ctx = this;
      expect(_.contains(ctx.scope.fields, 'Custom Field 1')).to.be.true;
      ctx.scope.delete('fields', 'Custom Field 1');
      ctx.scope.$digest();
      expect(_.contains(ctx.scope.fields, 'Custom Field 1')).to.be.false;
      expect(ctx.notify.success).to.have.been.calledWith('Deleted the Custom Field 1 field.');
    });
  });

});
