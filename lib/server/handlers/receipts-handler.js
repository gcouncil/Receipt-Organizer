module.exports = function(manager) {
  var ReceiptsHandler = {
    index: function(req, res, next) {
      manager.query({ user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.send(200, results);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, { user: req.user.id }, function(err, receipt) {
        if (err) { return next(err); }

        console.log(receipt);

        res.send(201, receipt);
      });
    },

    update: function(req, res, next) {
      manager.update(req.params.receipt, req.body, { user: req.user.id }, function(err, receipt) {
        if (err) { return next(err); }

        res.send(200, receipt);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.receipt, { user: req.user.id }, function(err, receipt) {
        if (err) { return next(err); }

        res.send(200);
      });
    }
  };
  return ReceiptsHandler;
};
