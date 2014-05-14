module.exports = function(manager) {
  var ClientsHandler = {
    create: function(req, res, next) {
      manager.create(function(err, cid) {
        if (err) { return next(err); }

        res.send(201, cid);
      });
    }
  };

  return ClientsHandler;
};

