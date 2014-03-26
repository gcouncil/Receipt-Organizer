module.exports = function(manager) {
  var ReceiptsHandler = {
    index: function(req, res, next) {
      manager.query({}, function(err, results) {
        if (err) { return next(err); }

        res.send(200, results);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, function(err, receipt) {
        if (err) { return next(err); }

        res.send(201, receipt);
      });
    }
  };
  return ReceiptsHandler;
};
