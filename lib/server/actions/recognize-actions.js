var async = require('async');
var boom = require('boom');

module.exports = function(services, managers) {
  return function(item, user, callback) {
    var ctx = {};

    async.waterfall([
      function(callback) {
        managers.items.fetch(item, { user: user }, callback);
      },
      function(item, callback) {
        ctx.item = item;

        if (item.type !== 'receipt') {
          return callback(boom.badRequest('Only receipts can be recognized'));
        }

        if (!item.image) {
          return callback(boom.badRequest('Only receipts with images can be recognized'));
        }

        managers.images.imageBuffer(item.image, { user: user }, callback);
      },
      function(image, callback) {
        services.formxtra(image.toString('base64'), {}, callback);
      },
      function(answers, callback) {
        managers.items.process(item, { user: user }, function(item, callback) {
          item.populateFromAnswers(answers);
          callback(null, item);
        }, callback);
      }
    ], function(err, result) {
      if (err) { return callback(err); }
      callback(null, result);
    });
  };
};
