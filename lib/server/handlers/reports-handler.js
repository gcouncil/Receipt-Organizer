module.exports = function(manager) {
  var ReportsHandler = {
    index: function(req, res, next) {
      manager.query({ user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.json(200, results);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, { user: req.user.id }, function(err, report) {
        if (err) { return next(err); }

        res.json(201, report);
      });
    },

    update: function(req, res, next) {
      manager.update(req.params.report, req.body, {user: req.user.id }, function(err, report) {
        if (err) { return next(err); }

        res.json(200, report);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.report, { user: req.user.id }, function(err, report) {
        if (err) { return next(err); }

        res.send(200);
      });
    }
  };
  return ReportsHandler;
};
