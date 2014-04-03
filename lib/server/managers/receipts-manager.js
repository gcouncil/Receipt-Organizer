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
      Receipt.collection().query('where', 'user', '=', options.user, 'orderBy', 'created_at')
      .fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.map(function(receipt) {
          return receipt.toDomain();
        }));
      });
    },

    create: function(attributes, options, callback) {
      console.log(arguments);
      var attrs = _.extend(attributes, { user: options.user });
      Receipt.create(attrs).exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, result.toDomain());
      });
    },

    update: function(id, attributes, options, callback) {
      Receipt.update(id, attributes).exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, result.toDomain());
      });
    },

    destroy: function(id, options, callback) {
      Receipt.forge({ id: id }).destroy().exec(callback);
    }
  };

  return ReceiptsManager;
};
