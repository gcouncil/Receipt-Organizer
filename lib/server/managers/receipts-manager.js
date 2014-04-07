var domain = require('epson-receipts/domain');
var TagsManager = require('./tags-manager').TagsManager;
var Tags = require('./tags-manager').Tags;

var _ = require('lodash');
var async = require('async');
var Boom = require('boom');

var WHITELIST = [
  'id',
  'date',
  'vendor',
  'paymentType',
  'category',
  'city',
  'state',
  'tax',
  'additionalTax',
  'total',
  'tip',
  'taxCategory',
  'businessPurpose',
  'reimbursable',
  'billable',
  'comments',
  'image'
];

module.exports = function(Bookshelf) {

  var Receipt = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'receipts',
    Domain: domain.Receipt
  });

  var Tagging = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'taggings',
  });

  var authorize = function(id, user, callback) {
    Receipt.load(id, function(err, receipt) {
      if (err) { return callback(err); }
      if (!receipt) { return callback(Boom.notFound()); }

      if (receipt.user !== user) {
        return callback(Boom.unauthorized());
      } else {
        return callback(null, receipt);
      }
    });
  };

  var createTags = function(receipt, tags, options, callback) {
    // for each tag
    // check if the tag exists
    // if so, do not create it
    // if not, create it
    // check if a tagging exists with this receipt and tag id
    // if so, do not create it
    // if not, create it
    // throw a PARTY!!!!

    _.each(tags, function(tagName, callback) {

      TagsManager.Tag.forge({ name: tagName, user: options.user }).fetch().exec(function(err, tag) {
        if (err) { return callback(err); }
        if (!tag) {

          tag = TagsManager.create({ name: tag }, options, function(err, tag) {
            if (err) { return callback(err); }
          });
        }

        Tagging.forge({ receipt: receipt, tag: tag }).fetch().exec(function(err, tagging) {
          if (err) { return callback(err); }
          if (tagging) { return callback(Boom.create(422, 'A tagging with that name already exists for this receipt!')) }

          Tagging.create({ receipt: receipt, tag: tag }, callback);
        });
      });
    });
    console.log('PARTY!!!!!!!!');
  };

  var ReceiptsManager = {
    query: function(options, callback) {
      Receipt.collection().query(function(query) {
        query.orderBy('created_at').where({ user: options.user });
      })
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.invoke('toDomain'));
      });
    },

    create: function(attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);
      var attrs = _.extend(attributes, { user: options.user });
      Receipt.create(attrs, function(err, receipt) {
        var tags = _.pick(attributes, 'tags').split(',');
        createTags(receipt, tags, options, callback);
      });

    },

    update: function(id, attributes, options, callback) {
      attributes = _.pick(attributes, WHITELIST);

      async.waterfall([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(receipt, callback) {
          receipt.set(attributes);
          Receipt.persist(receipt, { isNew: false }, callback);
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      async.series([
        function(callback) {
          authorize(id, options.user, callback);
        },
        function(callback) {
          Receipt.destroy(id, callback);
        }
      ], callback);
    }
  };

  return ReceiptsManager;
};
