var domain = require('epson-receipts/domain');

var _ = require('lodash');
var async = require('async');
var Boom = require('boom');
var Field = require('epson-receipts/domain/field');

var WHITELIST = [
  'id',
  'fields',
  'image',
  'folders',
  'reviewed',
].concat(_.pluck(Field.FIELD_DEFINITIONS, 'name'));

module.exports = function(Bookshelf) {

  var Item = Bookshelf.Domain.extend({
    hasTimestamps: ['createdAt', 'updatedAt'],
    tableName: 'items',
    Domain: domain.Item,

    // TODO(hsk): // Parse direction seems to "just work"... not sure why.
    format: function(attributes) {
      attributes.fields = JSON.stringify(attributes.fields);
      return Bookshelf.Domain.prototype.format.call(this, attributes);
    }
  });

  var authorize = function(id, user, callback) {
    Item.load(id, function(err, item) {
      if (err) { return callback(err); }
      if (!item) { return callback(Boom.notFound()); }

      if (item.user !== user) {
        return callback(Boom.forbidden());
      } else {
        return callback(null, item);
      }
    });
  };

  var ItemsManager = {
    query: function(options, callback) {
      Item.collection().query(function(query) {
        query.orderBy('created_at', 'DESC').where({ user: options.user });
      })
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.invoke('toDomain'));
      });
    },

    create: function(attributes, options, callback) {

      attributes = _.pick(attributes, WHITELIST);
      var attrs = _.extend(attributes, { user: options.user });

      // TODO(hsk): Only for backwards compatibility, we should try and clean things up so we don't need this
      attrs.type = attrs.type || 'receipt';

      Item.create(attrs, function(err, item) {
        if (err) { callback(err); }
        callback(null, item);
      });
    },

    update: function(id, attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);

      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(item, callback) {
          item.set(attributes);
          Item.persist(item, { isNew: false }, callback);
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Item.destroy(id, callback);
        }
      ], callback);
    },

    deleteFolders: function(id, options, callback) {
      Item.collection().query(function(query) {
        query.whereRaw('folders @> ?', [[id]]);
      })
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        async.each(results, function(item, callback) {
          item = item.toDomain();
          item.removeFolder(id);
          Item.persist(item, { isNew: false }, callback);
        }, callback);
      });
    }
  };

  return ItemsManager;
};
