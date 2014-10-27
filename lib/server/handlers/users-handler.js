var async = require('async');

module.exports = function(manager, mailer) {
  var UsersHandler = {
    create: function(req, res, next) {
      var ctx = {};

      async.waterfall([
        function(callback) {
          manager.create(req.body, callback);
        },
        function(user, callback) {
          ctx.user = user;
          mailer.sendSignupEmail(user, callback);
        }
      ], function(err) {
        if (err) { next(err); }
        res.send(201, ctx.user);
      });
    },

    update: function(req, res, next) {
      manager.update(req.user, req.body, function(err, user) {
        if (err) { return next(err); }

        res.send(200, user);
      });
    },

    updateSettings: function(req, res, next) {
      manager.updateSettings(req.user, req.body, function(err, user) {
        if (err) { return next(err); }

        res.send(200, user);
      });
    }
  };
  return UsersHandler;
};
