var domain = require('epson-receipts/domain');

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
  'image',
  'tags',
  'reviewed'
];

module.exports = function(Bookshelf) {

  var Receipt = Bookshelf.Domain.extend({
    hasTimestamps: ['createdAt', 'updatedAt'],
    tableName: 'receipts',
    Domain: domain.Receipt
  });

  var authorize = function(id, user, callback) {
    Receipt.load(id, function(err, receipt) {
      if (err) { return callback(err); }
      if (!receipt) { return callback(Boom.notFound()); }

      if (receipt.user !== user) {
        return callback(Boom.forbidden());
      } else {
        return callback(null, receipt);
      }
    });
  };

  var ReceiptsManager = {
    query: function(options, callback) {
      Receipt.collection().query(function(query) {
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

      Receipt.create(attrs, function(err, receipt) {
        if (err) { callback(err); }
        callback(null, receipt);
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
