var domain = require('epson-receipts/domain');
var _ = require('lodash');
var async = require('async');
var Boom = require('boom');

var WHITELIST = [
  'id',
  'name'
];


module.exports = function(Bookshelf) {
  var Tag = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'tags',
    Domain: domain.Tag
  });

  var authorize = function(id, user, callback) {
    Tag.load(id, function(err, tag) {
      if (err) { return callback(err); }
      if (!tag) { return callback(Boom.notFound()); }

      if (tag.user !== user) {
        return callback(Boom.unauthorized());
      } else {
        return callback(null, tag);
      }
    });
  };

  var TagsManager = {
    query: function(options, callback) {
      Tag.collection().query(function(query) {
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
      Tag.create(attrs, function(err, tag) {
        if (err) { return callback(err); }
        callback(null, tag);
      });
    },

    update: function(id, attributes, options, callback) {
      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(tag, callback) {
          tag.set(attributes);
          Tag.persist(tag, { isNew: false }, callback);
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Tag.destroy(id, callback);
        }
      ], callback);
    }
  };

  return TagsManager;
};

