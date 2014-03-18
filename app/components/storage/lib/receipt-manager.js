var _ = require('lodash');

var ReceiptManager = function(datastore) {
  this._datastore = datastore;
};

_.extend(ReceiptManager.prototype, {
  create: function(attributes) {
    var receipt = _.extend({ id: _.uniqueId('receipt') }, attributes);
    this._datastore._receipts.push(receipt);
  },

  update: function(receiptId, attributes) {
    var receipt = _.find(this._datastore._receipts, { id: receiptId });
    _.extend(receipt, attributes);
  },

  destroy: function(receiptId) {
    _.remove(this._datastore._receipts, { id: receiptId });
  }
});

module.exports = ReceiptManager;
