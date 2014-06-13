module.exports = function(manager) {
  var UsersHandler = {
    create: function(req, res, next) {
      manager.create(req.body, function(err, user) {
        if (err) { return next(err); }

        res.send(201, user);
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
