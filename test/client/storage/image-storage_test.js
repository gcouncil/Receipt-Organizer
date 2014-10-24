var angular = require('angular');
var expect = require('chai').expect;

describe('image storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.uuid = ctx.sinon.stub();
    ctx.domain = {
      Image: ctx.sinon.stub()
    };

    angular.mock.module('epsonreceipts.storage', {
      uuid: ctx.uuid,
      domain: ctx.domain,
      currentUser: {
        get: ctx.sinon.stub().returns({ token: 'TOKEN' })
      },
      offlineStorage: {
        isOffline: function() {
          return false;
        }
      }
    });
  });

  describe('create', function() {

    it('should create a new image', function() {
      var ctx = this;
      ctx.image = { id: 1, type: 'jpeg', image: 'IMAGE' };

      angular.mock.inject(function($rootScope, $q, $httpBackend, imageStorage) {
        ctx.deferred = $q.defer();
        ctx.uuid.returns(ctx.deferred.promise);
        $httpBackend.expectPUT(
          '/api/images/1',
          ctx.image,
          { 'Content-Type': 'jpeg', 'Accept': 'application/json, text/plain, */*' }
        ).respond(200, 'IMAGE');

        imageStorage.create(ctx.image);
        ctx.deferred.resolve(1);

        $httpBackend.flush();
        $rootScope.$digest();
        expect(ctx.domain.Image).to.have.been.calledWithNew;
      });
    });

  });

  describe('fetch', function() {
    it('should reject fetch if no id is supplied', function(done) {
      angular.mock.inject(function($rootScope, $q, imageStorage) {
        var promise = imageStorage.fetch({});

        expect(promise).to.eventually.be.rejected.and.notify(done);
        $rootScope.$digest();
      });
    });

    it('should request the image from the server if it has not already been fetched', function(done) {
      var ctx = this;
      ctx.image = { id: 3, type: 'jpeg', image: 'IMAGE' };

      angular.mock.inject(function($rootScope, $q, $httpBackend, imageStorage) {
        $httpBackend.expectGET('/api/images/3?access_token=TOKEN').respond(200, ctx.image);

        var promise = imageStorage.fetch({ id: 3 });
        $httpBackend.flush();
        expect(promise).to.eventually.deep.equal(ctx.image).and.notify(done);
        $rootScope.$digest();
      });
    });
  });
});
