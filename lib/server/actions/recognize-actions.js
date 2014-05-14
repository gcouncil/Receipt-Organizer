var async = require('async');
var boom = require('boom');

module.exports = function(services, managers) {
  return function(req, res, next) {
    var ctx = {};

    async.waterfall([
      function(callback) {
        managers.items.fetch(req.params.item, { user: req.user.id }, callback);
      },
      function(item, callback) {
        ctx.item = item;

        if (item.type !== 'receipt') {
          return callback(boom.badRequest('Only receipts can be recognized'));
        }

        if (!item.image) {
          return callback(boom.badRequest('Only receipts with images can be recognized'));
        }

        managers.images.imageBuffer(item.image, { user: req.user.id }, callback);
      },
      function(image, callback) {
        console.log('Image', image.toString('base64'));
        services.formxtra(image.toString('base64'), {}, callback);
      },
      function(answers, callback) {
        managers.items.process(req.params.item, { user: req.user.id }, function(item, callback) {
          item.populateFromAnswers(answers);
          callback(null, item);
        }, callback);
      }
    ], function(err, result) {
      if (err) { return next(err); }

      res.send(200, result);
    });
  };
};
