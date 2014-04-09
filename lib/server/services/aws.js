var AWS = require('aws-sdk');

module.exports = function(config) {
  AWS.config.update(config.aws);

  return AWS;
};
