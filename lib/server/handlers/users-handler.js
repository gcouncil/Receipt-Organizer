module.exports = function(manager) {
  var UsersHandler = {
    create: function(req, res, next) {
      manager.create(req.body, function(err, user) {
        if (err) { return next(err); }

        res.send(201, user);
      });
    },

    updateSettings: function(req, res, next) {
      manager.updateSettings(req.user, req.body, function(err, user) {
        if (err) { return next(err); }

        res.send(user);
      });
    }
  };
  return UsersHandler;
};
