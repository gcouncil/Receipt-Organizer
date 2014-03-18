var _ = require('lodash');

var ReceiptManager = function(datastore) {
  this._datastore = datastore;
};

_.extend(ReceiptManager.prototype, {
  create: function(attributes) {
    this._datastore._receipts.push(_.clone(attributes));
  }
});

module.exports = ReceiptManager;
