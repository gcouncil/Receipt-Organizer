/* global Promise */
require('es6-shim');
var _ = require('lodash');
var indexedDB = require('indexeddb-shim');
var uuid = require('uuid');

function makePromise(request) {
  return new Promise(function(resolve, reject) {
    request.addEventListener('success', function() {
      resolve(request.result);
    });

    request.addEventListener('error', function() {
      reject(request.error);
    });
  });
}

function IdbStore(dbname) {
  var request = indexedDB.open(dbname, 1);
  var promise = makePromise(request);

  request.onupgradeneeded = function(event) {
    console.log('upgrade');
    var version = event.oldVersion;
    var db = request.result;

    if (version < 1) {
      db.createObjectStore('items', { keyPath: 'id' });
      db.createObjectStore('images', { keyPath: 'id' });
      db.createObjectStore('folders', { keyPath: 'id' });
    }
  };

  this.promise =
  promise
  .catch(function(err) {
    console.error(err);
    throw err;
  });
}

IdbStore.prototype.close = function() {
  var promise = this.promise.then(function(db) {
    db.close();
  });

  this.promise = Promise.reject(new Error('Cache database was closed'));

  return promise;
};

IdbStore.prototype.load = function(collection) {
  return this.promise.then(function(db) {
    var trx = db.transaction(collection, 'readonly');

    var values = [];
    var cursor = trx.objectStore(collection).openCursor();

    cursor.onsuccess = function() {
      if (cursor.result) {
        values.push(cursor.result.value);
        cursor.result.continue();
      }
    };

    return new Promise(function(resolve, reject) {
      trx.oncomplete = function() {
        resolve(values);
      };
      trx.onerror = function() { reject(trx.error); };
    });
  });
};

IdbStore.prototype.store = function(collection, id, data) {
  if (data && _.isFunction(data.toJSON)) { data = data.toJSON(); }
  id = id || data.id;
  if (!id) { id = uuid.v1(); }

  return this.promise.then(function(db) {
    var trx = db.transaction(collection, 'readwrite');
    var store = trx.objectStore(collection);

    var request = store.get(id);

    var resolve, reject;
    var promise = new Promise(function(resolve_, reject_) {
      resolve = resolve_;
      reject = reject_;
    });

    request.onsuccess = function() {
      var original = request.result;

      if (data) {
        data = _.extend({ id: id }, original, data);
        request = store.put(data);
      } else {
        data = undefined;
        request = store.delete(id);
      }

      request.onsuccess = function() {
        resolve(data);
      };

      request.onerror = function() {
        resolve(request.error);
      };
    };

    request.onerror = function() {
      reject(request.error);
    };

    return promise;
  });

};

module.exports = IdbStore;
