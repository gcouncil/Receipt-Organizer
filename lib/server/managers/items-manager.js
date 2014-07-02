var _ = require('lodash');
var async = require('async');
var boom = require('boom');
var Item = require('epson-receipts/domain/item');
var Field = require('epson-receipts/domain/field');

var WHITELIST = [
  'receipt',
  'type',
  'fields',
  'images',
  'folders',
  'reviewed',
  'formxtraStatus',
].concat(_.pluck(Field.FIELD_DEFINITIONS, 'name'));

module.exports = function(repository) {
  function authorize(object, user, callback) {
    if (object.user !== user && user !== true) {
      return callback(boom.forbidden());
    } else {
      return callback(null, object);
    }
  }

  var ItemsManager = {};

  ItemsManager.query = function(options, callback) {
    repository.search(options.user, {}, callback);
  };

  ItemsManager.fetch = function(id, options, callback) {
    async.waterfall([
      function(callback) {
        repository.load(id, callback);
      },
      function(object, callback) {
        authorize(object, options.user, callback);
      }
    ], callback);
  };

  ItemsManager.create = function(attributes, options, callback) {
    attributes = _.pick(attributes, WHITELIST.concat('id'));
    var attrs = _.extend(attributes, { user: options.user });

    // TODO(hsk): Only for backwards compatibility, we should try and clean
    // things up so we don't need this
    attrs.type = attrs.type || 'receipt';

    var object = Item.load(attrs);

    repository.save(object, callback);
  };

  ItemsManager.update = function(id, attributes, options, callback) {
    attributes = _.pick(attributes, WHITELIST);

    this.process(id, options, function(object, callback) {
      object.set(attributes);
      callback(null, object);
    }, callback);
  };

  ItemsManager.process = function(id, options, fn, callback) {
    repository.process(id, function(object, callback) {
      async.waterfall([
        function(callback) {
          authorize(object, options.user, callback);
        },
        fn
      ], callback);
    }, callback);
  };

  ItemsManager.destroy = function(id, options, callback) {
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

  ItemsManager.deleteFolders = function(id, options, callback) {
    async.waterall([
      function(callback) {
        repository.byFolder(id, callback);
      },
      function(items, callback) {
        async.eachLimit(items, 4, function(item, callback) {
          item.removeFolder(id);
          repository.save(item, callback);
        }, callback);
      }
    ], callback);
  };

  return ItemsManager;
};
