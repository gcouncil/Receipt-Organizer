module.exports = function(manager) {
  var ItemsHandler = {
    index: function(req, res, next) {
      manager.query({ user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.json(200, results);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, { user: req.user.id }, function(err, item) {
        if (err) { return next(err); }

        res.json(201, item);
      });
    },

    update: function(req, res, next) {
      manager.update(req.params.item, req.body, { user: req.user.id }, function(err, item) {
        if (err) { return next(err); }

        res.json(200, item);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.item, { user: req.user.id }, function(err, item) {
        if (err) { return next(err); }

        res.send(200);
      });
    }
  };
  return ItemsHandler;
};
