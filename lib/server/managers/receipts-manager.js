var domain = require('epson-receipts/domain');
var _ = require('lodash');
var async = require('async');


module.exports = function(Bookshelf) {

  var Receipt = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'receipts',
    Domain: domain.Receipt
  });

  var authorizeUser = function(id, user, callback) {
    Receipt.forge({ id: id }).fetch().exec(function(err, result) {
      if (err) { return callback(err); }
      if (!result) { return callback('No receipt matches that id.'); }

      if (result.attributes.user !== user) {
        return callback(401);
      } else {
        return callback(null, true);
      }
    });
  };

  var ReceiptsManager = {
    query: function(options, callback) {
      Receipt.collection().query('where', 'user', '=', options.user, 'orderBy', 'created_at')
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.map(function(receipt) {
          return receipt.toDomain();
        }));
      });
    },

    create: function(attributes, options, callback) {
      var attrs = _.extend(attributes, { user: options.user });
      Receipt.create(attrs).exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, result.toDomain());
      });
    },

    update: function(id, attributes, options, callback) {
      console.log(id, attributes, options);
      async.series([
        function(callback) {
          authorizeUser(id, options.user, callback);
        },
        function(callback) {
          Receipt.update(id, attributes).exec(function(err, result) {
            if (err) { return callback(err); }
            callback(null, result.toDomain());
          });
        }
      ], callback);
    },

    destroy: function(id, options, callback) {
      async.series([
        function(callback) {
          authorizeUser(id, options.user, callback);
        },
        function(callback) {
          Receipt.forge({ id: id }).destroy().exec(function(err, result) {
            if (err) { return callback(err); }
            callback(null, 'Success');
          });
        }
      ], callback);
    }
  };

  return ReceiptsManager;
};
