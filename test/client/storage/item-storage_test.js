var angular = require('angular');
var expect = require('chai').expect;
var moment = require('moment');

function waitFor(promise, done) {
  function cb() {
    var args = arguments;
    var self = this;
    setTimeout(function() {
      done.apply(self, args);
    }, 0);
  }

  promise.then(function() { cb(); }, cb);
}

function seedItems(done) {
  angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
    $httpBackend.expectGET('/api/items').respond(200, [ {id: 1, name: 'ITEM1'}, {id: 2, name: 'ITEM2'} ]);

    var promise = itemStorage.load();

    $httpBackend.flush();

    waitFor(promise, done);
    $rootScope.$digest();
  });
}

describe('item storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Item: ctx.sinon.stub().returnsArg(0),
      Folder: ctx.sinon.stub()
    };

    ctx.domain.Item.load = ctx.sinon.stub().returnsArg(0);

    angular.mock.module('epsonreceipts.storage', {
      domain: ctx.domain
    });
  });

  describe('load', function() {
    it('should get the items from the server', function(done) {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, $q, itemStorage) {
        $httpBackend.expectGET('/api/items').respond(200, [ {id: 1, name: 'ITEM1', folders: [1]}, {id: 2, name: 'ITEM2', folders: [2]} ]);

        var promise = itemStorage.load();

        $httpBackend.flush();
        expect(ctx.domain.Item.load).to.have.been.calledTwice;
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('fetch', function() {
    beforeEach(seedItems);

    it('should fetch the item', function(done) {
      var ctx = this;
      ctx.item = { id: 2, name: 'ITEM2' };
      angular.mock.inject(function($rootScope, itemStorage) {
        var promise = itemStorage.fetch(2);

        expect(promise).to.eventually.deep.equal(ctx.item).and.notify(done);

        $rootScope.$digest();
      });
    });

  });

  describe('watch', function() {

    beforeEach(function() {
      var ctx = this;

      ctx.items = [{
        id: 1,
        vendor: 'CBS',
        name: 'ITEM1',
        folders: [1],
        createdAt: moment().subtract(0, 'days').toJSON()
      }, {
        id: 2,
        vendor: 'ABC',
        name: 'ITEM2',
        folders: [2],
        createdAt: moment().subtract(1, 'days').toJSON()
      }];

      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
        $httpBackend.expectGET('/api/items').respond(200, ctx.items);

        itemStorage.load();

        $httpBackend.flush();

        $rootScope.$digest();
      });
    });

    it('should watch the item collection', function() {
      var ctx = this;

      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
        ctx.scope = $rootScope.$new();
        $httpBackend.whenGET('/api/items').respond(200, ctx.items);
        $httpBackend.whenGET('/api/folders').respond(200);

        itemStorage.watch(ctx.scope, function(result) {
          expect(result).to.deep.equal(ctx.items);
        });

        $httpBackend.flush();
        $rootScope.$digest();
      });
    });

    it('should filter the item collection', function() {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
        ctx.scope = $rootScope.$new();
        $httpBackend.whenGET('/api/items').respond(200, ctx.items);
        $httpBackend.whenGET('/api/folders').respond(200);

        itemStorage.watch(ctx.scope, function(result) {
          ctx.result = result;
        }).setFilter('isItem1', function(item) {
          return item.name === 'ITEM1';
        });

        $httpBackend.flush();
        $rootScope.$digest();

        expect(ctx.result).not.to.deep.equal(ctx.items);
        expect(ctx.result).to.have.deep.members(ctx.items.slice(0, 1));
      });
    });

    it('should sort the item collection', function() {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
        ctx.scope = $rootScope.$new();
        $httpBackend.expectGET('/api/items').respond(200, ctx.items);
        $httpBackend.whenGET('/api/folders').respond(200);

        var query = itemStorage.watch(ctx.scope, function(result) {
          ctx.result = result;
        });

        query.setSort('vendor');
        expect(ctx.result).to.deep.equal(ctx.items.reverse());

        $httpBackend.flush();
        $rootScope.$digest();
      });

    });
  });

  describe('create', function() {
    it('should send a new item to the server', function(done) {
      var ctx = this;
      ctx.item = { id: 4, name: 'ITEM4' };
      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
        $httpBackend.expectPOST('/api/items').respond(201, ctx.item);

        ctx.domain.Item.load.returns(ctx.item);

        var promise = itemStorage.create(ctx.item);

        $httpBackend.flush();
        expect(ctx.domain.Item.load).to.have.been.called;
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('update', function() {
    it('should change the item on the server', function(done) {
      var ctx = this;
      ctx.item = { id: 5, name: 'ITEM5' };
      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
        $httpBackend.expectPUT('/api/items/5').respond(200, ctx.item);

        ctx.domain.Item.returns(ctx.item);

        var promise = itemStorage.update(ctx.item);

        $httpBackend.flush();
        expect(ctx.domain.Item.load).to.have.been.called;
        expect(promise).to.eventually.deep.equal(ctx.item).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('persist', function() {
    beforeEach(seedItems);

    it('should update the item if it exists', function(done) {
      var ctx = this;
      ctx.item = { id: 2, name: 'ITEM2' };
      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {

        $httpBackend.expectPUT('/api/items/2').respond(201, ctx.item);
        var promise = itemStorage.persist(ctx.item);

        $httpBackend.flush();
        expect(ctx.domain.Item.load).to.have.been.called;
        expect(promise).to.eventually.deep.equal(ctx.item).and.notify(done);

        $rootScope.$digest();
      });

    });

    it('should create the item if it doesnt exist', function(done) {
      var ctx = this;
      ctx.item = { id: 6, name: 'ITEM6' };
      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {

        $httpBackend.expectPOST('/api/items').respond(201, ctx.item);
        var promise = itemStorage.persist(ctx.item);

        $httpBackend.flush();
        expect(ctx.domain.Item.load).to.have.been.called;
        expect(promise).to.eventually.deep.equal(ctx.item).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('destroy', function() {
    beforeEach(seedItems);

    it('should destroy the item', function(done) {
      var ctx = this;
      ctx.item = { id: 2, name: 'ITEM2' };
      angular.mock.inject(function($rootScope, $httpBackend, itemStorage) {
        $httpBackend.expectDELETE('/api/items/2').respond(200);

        var promise = itemStorage.destroy(ctx.item);

        $httpBackend.flush();
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });


});
