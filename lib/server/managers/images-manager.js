var async = require('async');
var uuid = require('uuid');
var domain = require('epson-receipts/domain');
var _ = require('lodash');
var async = require('async');
var Boom = require('boom');

var WHITELIST = [
  'id',
  'data',
  'url'
];


module.exports = function(services) {
  var Bookshelf = services.database;
  var AWS = services.aws;
  var config = services.config;

  var s3 = new AWS.S3();
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
        return callback(Boom.forbidden());
      } else {
        return callback(null, image);
      }
    });
  };

  var ImagesManager = {
    fetch: function(id, options, callback) {
      authorize(id, options.user, callback);
    },

    imageUrl: function(id, options, callback) {
      authorize(id, options.user, function(err, image) {
        if (err) { return callback(err); }

        s3.getSignedUrl('getObject', {
          Bucket: config.storage.receiptBucket,
          Key: image.id,
          Expires: 30
        }, callback);
      });
    },

    create: function(attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);
      attributes = _.extend(attributes, { user: options.user });

      async.series([
        function ensureId(callback) {
          if (!attributes.id) {
            attributes.id = uuid.v1();
          }
          callback();
        },
        function uploadToS3(callback) {
          s3.putObject({
            Bucket: config.storage.receiptBucket,
            Key: attributes.id,
            ContentType: 'image/jpeg',
            Body: new Buffer(attributes.data, 'base64')
          }, callback);

          attributes.data = undefined;
        },
        function createRecord(callback) {
          Image.create(attributes, callback);
        }
      ], function(err, results) {
        callback(err, _.last(results));
      });
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

