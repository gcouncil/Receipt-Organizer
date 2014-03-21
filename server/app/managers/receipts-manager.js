var domain = require('epson-receipts-domain');

var receipts = [
  new domain.Receipt({
    date: new Date(),
    vendor: 'Quick Left',
    total: 100.42
  })
];

module.exports = function() {
  var ReceiptsManager = {
    query: function(options, callback) {
      callback(null, receipts);
    },

    create: function(attributes, callback) {
      var receipt = new domain.Receipt(attributes);

      // TODO: Save to postgresql
      receipts.push(receipt);

      callback(null, receipt);
    }
  };

  return ReceiptsManager;
};
