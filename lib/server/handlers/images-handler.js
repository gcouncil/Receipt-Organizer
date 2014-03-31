module.exports = function(manager) {
  var ImagesHandler = {
    index: function(req, res, next) {
      manager.query({}, function(err, results) {
        if (err) { return next(err); }

        res.send(200, results);
      });
    },

    show: function(req, res, next) {
      manager.fetch(req.params.image, function(err, image) {
        if (err) { return next(err); }

        res.send(image);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, function(err, image) {
        if (err) { return next(err); }

        res.send(201, image);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.image, function(err, image) {
        if (err) { return next(err); }

        res.send(200);
      });
    }
  };
  return ImagesHandler;
};

