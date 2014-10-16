var angular = require('angular');
var expect = require('chai').expect;

describe('folder storage service', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Folder: ctx.sinon.stub().returnsArg(0)
    };
    ctx.currentUser = {
      get: ctx.sinon.stub().returns({ id: 'USER' })
    };

    angular.mock.module('epsonreceipts.storage', {
      domain: ctx.domain,
      currentUser: ctx.currentUser
    });

    angular.mock.inject(function(offlineStorage) {
      ctx.sinon.stub(offlineStorage, 'isOffline').returns(false);
    });
  });

  describe('query', function(done) {
    beforeEach(function() {
      var ctx = this;
      ctx.folders = [ { id: 1, name: 'FOLDER1' }, { id: 2, name: 'FOLDER2' } ];
    });

    it('should work without options', function(done) {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, folderStorage) {
        $httpBackend.expectGET('/api/folders').respond(200, ctx.folders);

        var result = folderStorage.query({});
        $httpBackend.flush();

        expect(result).to.eventually.deep.equal(ctx.folders).and.notify(done);

        $rootScope.$digest();
      });
    });

    it('should work with a callback', function() {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, folderStorage) {
        $httpBackend.expectGET('/api/folders').respond(200, ctx.folders);

        folderStorage.query({}, function(folders) {
          expect(folders).to.deep.equal(ctx.folders);
        });

        $httpBackend.flush();
        $rootScope.$digest();
      });
    });
  });

  describe('create', function() {
    it('should notify queries of create', function(done) {
      var ctx = this;
      ctx.folder = { id: 3, name: 'FOLDER3' };
      var folders;
      angular.mock.inject(function($rootScope, $httpBackend, folderStorage) {
        $httpBackend.expectGET('/api/folders').respond(200, ctx.folders);
        ctx.scope = $rootScope.$new();

        folderStorage.query({ scope: ctx.scope }, function(folders_) {
          folders = folders_;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        folders.push(ctx.folder);

        $httpBackend.expectPOST('/api/folders').respond(201, ctx.folder);

        var promise = folderStorage.create(ctx.folder);

        $httpBackend.flush();
        $rootScope.$digest();

        expect(folders).to.contain(ctx.folder);
        expect(promise).to.notify(done);
      });
    });
  });

  describe('update', function() {
    it('should notify queries of update', function(done) {
      var ctx = this;
      ctx.folder = { id: 1, name: 'FOLDER1.1' };
      var folders;
      angular.mock.inject(function($rootScope, $httpBackend, folderStorage) {
        $httpBackend.expectGET('/api/folders').respond(200, ctx.folders);
        ctx.scope = $rootScope.$new();

        folderStorage.query({ scope: ctx.scope }, function(folders_) {
          folders = folders_;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        folders.push(ctx.folder);

        $httpBackend.expectPUT('/api/folders/1').respond(200, ctx.folder);

        var promise = folderStorage.update(ctx.folder);

        $httpBackend.flush();
        $rootScope.$digest();

        expect(folders).to.contain(ctx.folder);
        expect(promise).to.notify(done);
      });
    });
  });

  describe('destroy', function() {
    it('should notify queries of destroy', function(done) {
      var ctx = this;
      ctx.folder = { id: 1, name: 'FOLDER1' };
      var folders;
      angular.mock.inject(function($rootScope, $httpBackend, folderStorage) {
        $httpBackend.expectGET('/api/folders').respond(200, ctx.folders);
        ctx.scope = $rootScope.$new();

        folderStorage.query({ scope: ctx.scope }, function(folders_) {
          folders = folders_;
        });

        $httpBackend.flush();
        $rootScope.$digest();

        var folderIndex = folders.indexOf(ctx.folder);
        folders.splice(folderIndex, 1);

        $httpBackend.expectDELETE('/api/folders/1').respond(200);

        var promise = folderStorage.destroy(ctx.folder);

        $httpBackend.flush();
        $rootScope.$digest();

        expect(folders).not.to.contain(ctx.folder);
        expect(promise).to.notify(done);
      });
    });
  });
});
