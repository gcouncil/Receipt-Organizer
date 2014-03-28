var _ = require('lodash');

module.exports = function(persistence) {
  exports.Model = require('./model')(exports);

  _.extend(exports, {
    receipts: require('./receipts'),
    imageSet: require('./image-set')
  });
};
