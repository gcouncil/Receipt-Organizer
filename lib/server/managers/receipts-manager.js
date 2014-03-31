var domain = require('epson-receipts/domain');
var _ = require('lodash');

module.exports = function(Bookshelf) {

  var Receipt = Bookshelf.Domain.extend({
    hasTimestamps: true,
    tableName: 'receipts',
    Domain: domain.Receipt
  });

  var ReceiptsManager = {
    query: function(options, callback) {
      Receipt.collection().query('orderBy', 'created_at').fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.map(function(receipt) {
          return receipt.toDomain();
        }));
      });
    },

    create: function(attributes, callback) {
      Receipt.fromAttributes(attributes).save().exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, result.toDomain());
      });
    },

    update: function(id, attributes, callback) {
      attributes = _.extend({ id: id }, attributes);

      Receipt.fromAttributes(attributes).save().exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, result.toDomain());
      });
    },

    destroy: function(id, callback) {
      Receipt.forge({ id: id }).destroy().exec(callback);
    }
  };

  return ReceiptsManager;
};
