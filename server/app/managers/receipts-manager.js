var domain = require('epson-receipts-domain');

module.exports = function() {
  var ReceiptsManager = {
    query: function(options, callback) {
      callback(null, [
        new domain.Receipt({
          date: new Date(),
          vendor: 'Quick Left',
          total: 100.42
        })
      ]);
    }
  };

  return ReceiptsManager;
};
