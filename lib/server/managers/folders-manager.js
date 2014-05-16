var _ = require('lodash');
var async = require('async');
var boom = require('boom');
var Folder = require('epson-receipts/domain/folder');

var WHITELIST = [
  'name'
];

module.exports = function(repository) {
  function authorize(object, user, callback) {
    if (object.user !== user && user !== true) {
      return callback(boom.forbidden());
    } else {
      return callback(null, object);
    }
  }

  var FoldersManager = {};

  FoldersManager.query = function(options, callback) {
    repository.search(options.user, {}, callback);
  };

  FoldersManager.create = function(attributes, options, callback) {
    attributes = _.pick(attributes, WHITELIST.concat('id'));
    var attrs = _.extend(attributes, { user: options.user });

    var object = new Folder(attrs);

    repository.save(object, callback);
  };

  FoldersManager.update = function(id, attributes, options, callback) {
    attributes = _.pick(attributes, WHITELIST);

    this.process(id, options, function(object, callback) {
      object.set(attributes);
      callback(null, object);
    }, callback);
  };

  FoldersManager.process = function(id, options, fn, callback) {
    repository.process(id, function(object, callback) {
      async.waterfall([
        function(callback) {
          authorize(object, options.user, callback);
        },
        fn
      ], callback);
    }, callback);
  };

  FoldersManager.destroy = function(id, options, callback) {
    async.waterfall([
      function(callback) {
        repository.load(id, callback);
      },
      function(object, callback) {
        authorize(object, options.user, callback);
      },
      function(object, callback) {
        repository.destroy(object, callback);
      }
    ], callback);
  };

  return FoldersManager;
};
