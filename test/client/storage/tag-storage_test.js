var angular = require('angular');
var expect = require('chai').expect;

describe('tag storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Tag: ctx.sinon.stub().returnsArg(0)
    };

    ctx.offline = {
      isOffline: function() {
        return false;
      }
    };

    angular.mock.module('epsonreceipts.storage', {
      domain: ctx.domain,
      offline: ctx.offline
    });
  });

  describe('query', function(done) {
    beforeEach(function() {
      var ctx = this;
      ctx.tags = [ { id: 1, name: 'TAG1' }, { id: 2, name: 'TAG2' } ];
    });

    it('should work without options', function(done) {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, tagStorage) {
        $httpBackend.expectGET('/api/tags').respond(200, ctx.tags);

        var result = tagStorage.query({});
        $httpBackend.flush();
        expect(ctx.domain.Tag).to.have.been.called.withNew;
        expect(result).to.eventually.deep.equal(ctx.tags).and.notify(done);

        $rootScope.$digest();

      });
    });

    it('should work with a callback', function() {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, tagStorage) {
        $httpBackend.expectGET('/api/tags').respond(200, ctx.tags);

        tagStorage.query({}, function(tags) {
          expect(ctx.domain.Tag).to.have.been.called.withNew;
          expect(tags).to.deep.equal(ctx.tags);
        });

        $httpBackend.flush();
        $rootScope.$digest();

      });
    });
  });

  describe('create', function() {
    it('should notify queries of create', function() {
      var ctx = this;
      ctx.tag = { id: 3, name: 'TAG3' };
      var tags;
      angular.mock.inject(function($rootScope, $httpBackend, tagStorage) {
        $httpBackend.expectGET('/api/tags').respond(200, ctx.tags);
        ctx.scope = $rootScope.$new();

        tagStorage.query({ scope: ctx.scope }, function(tags_) {
          tags = tags_;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        tags.push(ctx.tag);

        $httpBackend.expectPOST('/api/tags').respond(201, ctx.tag);
        $httpBackend.expectGET('/api/tags').respond(200, tags);

        tagStorage.create(ctx.tag);

        $httpBackend.flush();
        $rootScope.$digest();

        expect(tags).to.contain(ctx.tag);
      });
    });
  });

  describe('update', function() {
    it('should notify queries of update', function() {
      var ctx = this;
      ctx.tag = { id: 1, name: 'TAG1.1' };
      var tags;
      angular.mock.inject(function($rootScope, $httpBackend, tagStorage) {
        $httpBackend.expectGET('/api/tags').respond(200, ctx.tags);
        ctx.scope = $rootScope.$new();

        tagStorage.query({ scope: ctx.scope }, function(tags_) {
          tags = tags_;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        tags.push(ctx.tag);

        $httpBackend.expectPUT('/api/tags/1').respond(200, ctx.tag);
        $httpBackend.expectGET('/api/tags').respond(200, tags);

        tagStorage.update(ctx.tag);

        $httpBackend.flush();
        $rootScope.$digest();

        expect(tags).to.contain(ctx.tag);
      });

    });
  });

  describe('destroy', function() {
    it('should notify queries of destroy', function() {
      var ctx = this;
      ctx.tag = { id: 1, name: 'TAG1' };
      var tags;
      angular.mock.inject(function($rootScope, $httpBackend, tagStorage) {
        $httpBackend.expectGET('/api/tags').respond(200, ctx.tags);
        ctx.scope = $rootScope.$new();

        tagStorage.query({ scope: ctx.scope }, function(tags_) {
          tags = tags_;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        var tagIndex = tags.indexOf(ctx.tag);
        tags.splice(tagIndex, 1);

        $httpBackend.expectDELETE('/api/tags/1').respond(200);
        $httpBackend.expectGET('/api/tags').respond(200, tags);

        tagStorage.destroy(ctx.tag);

        $httpBackend.flush();
        $rootScope.$digest();

        expect(tags).not.to.contain(ctx.tag);
      });

    });
  });

});
