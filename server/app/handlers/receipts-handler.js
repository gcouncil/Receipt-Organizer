module.exports = function(manager) {
  var ReceiptsHandler = {
    index: function(req, res, next) {
      manager.query({}, function(err, results) {
        if (err) { return next(err); }

        res.send(200, results);
      });
    }
  };
  return ReceiptsHandler;
};
