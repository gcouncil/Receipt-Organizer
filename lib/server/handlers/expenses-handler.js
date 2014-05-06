module.exports = function(manager) {
  var ExpensesHandler = {
    index: function(req, res, next) {
      manager.query({ user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.send(200, results);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, { user: req.user.id }, function(err, expense) {
        if (err) { return next(err); }

        res.send(201, expense);
      });
    },

    update: function(req, res, next) {
      manager.update(req.params.expense, req.body, { user: req.user.id }, function(err, expense) {
        if (err) { return next(err); }

        res.send(200, expense);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.expense, { user: req.user.id }, function(err, expense) {
        if (err) { return next(err); }

        res.send(200);
      });
    }
  };
  return ExpensesHandler;
};
