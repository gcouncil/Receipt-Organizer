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

    updateSettings: function(req, res, next) {
      console.log('update', req.body, req.user);
      manager.updateSettings(req.user, req.body, function(err, user) {
        if (err) { return next(err); }

        res.send(200, user);
      });
    }
  };
  return UsersHandler;
};
