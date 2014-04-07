var domain = require('epson-receipts/domain');
var _ = require('lodash');
var async = require('async');
var Boom = require('boom');

var WHITELIST = [
  'id',
  'data',
  'url'
];


module.exports = function(Bookshelf) {
  var Image = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'images',
    Domain: domain.Image
  });

  var authorize = function(id, user, callback) {
    Image.load(id, function(err, image) {
      if (err) { return callback(err); }
      if (!image) { return callback(Boom.notFound()); }

      if (image.user !== user) {
        return callback(Boom.unauthorized());
      } else {
        return callback(null, image);
      }
    });
  };

  var ImagesManager = {
    fetch: function(id, options, callback) {
      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Image.load(id, callback);
        }
      ], callback);
    },

    create: function(attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);

      var attrs = _.extend(attributes, { user: options.user });
      Image.create(attrs, callback);
    },

    destroy: function(id, options, callback) {
      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Image.destroy(id, callback);
        }
      ], callback);
    }
  };

  return ImagesManager;
};

