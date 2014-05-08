var domain = require('epson-receipts/domain');
var _ = require('lodash');
var async = require('async');
var Boom = require('boom');
var util = require('util');

var WHITELIST = [
  'id',
  'name'
];

module.exports = function(Bookshelf) {
  return new FoldersManager(Bookshelf);
};

util.inherits(FoldersManager, require('events').EventEmitter);

function FoldersManager(Bookshelf) {
  var Folder = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'folders',
    Domain: domain.Folder
  });

  var authorize = function(id, user, callback) {
    Folder.load(id, function(err, folder) {
      if (err) { return callback(err); }
      if (!folder) { return callback(Boom.notFound()); }

      if (folder.user !== user) {
        return callback(Boom.unauthorized());
      } else {
        return callback(null, folder);
      }
    });
  };

  _.extend(this, {
    query: function(options, callback) {
      Folder.collection().query(function(query) {
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
      Folder.create(attrs, function(err, folder) {
        if (err) { return callback(err); }
        callback(null, folder);
      });
    },

    update: function(id, attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);

      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(folder, callback) {
          folder.set(attributes);
          Folder.persist(folder, { isNew: false }, callback);
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      var self = this;

      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Folder.destroy(id, callback);
        },
        function(callback) {
          async.applyEach(
            self.listeners('destroy'),
            id,
            callback
          );
        }
      ], callback);
    }
  });

}
