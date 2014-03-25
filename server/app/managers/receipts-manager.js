var domain = require('epson-receipts-domain');
var morph = require('morph');
var _ = require('lodash');

module.exports = function(Bookshelf) {

  var Receipt = Bookshelf.Model.extend({
    tableName: 'receipts'
  });

  var ReceiptsManager = {
    query: function(options, callback) {
      Receipt.collection().fetch().exec(function(err, results) {
        if (err) { return callback(err); }

        callback(null, results.map(function(receipt) {
          var attrs = morph.toCamel(receipt.attributes);
          return new domain.Receipt(attrs);
        }));
      });
    },

    create: function(attributes, callback) {
      var receipt = new domain.Receipt(attributes);

      var attrs = _.omit(morph.toSnake(receipt.toJSON()), 'id');

      Receipt.forge(attrs).save().exec(function(err, result) {
        if (err) { return callback(err); }

        callback(null, morph.toCamel(receipt));
      });
    }
  };

  return ReceiptsManager;
};