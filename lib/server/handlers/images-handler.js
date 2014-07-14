module.exports = function(manager) {
  var ImagesHandler = {
    show: function(req, res, next) {
      manager.imageBuffer(req.params.image, { user: req.user.id }, function(err, image, type) {
        if (err) { return next(err); }

        res.type(type);
        res.send(image);
      });
    },

    showMetadata: function(req, res, next) {
      manager.fetch(req.params.image, { user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.send(results);
      });
    },

    create: function(req, res, next) {
      req.accepts('image');

      manager.create(req, {
        contentType: req.get('content-type'),
        contentLength: req.get('content-length')
      }, {
        id: req.params.image,
        user: req.user.id
      }, function(err, image) {
        if (err) { return next(err); }
        res.send(201, image);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.image, { user: req.user.id }, function(err, image) {
        if (err) { return next(err); }

        res.send(200);
      });
    }
  };
  return ImagesHandler;
};
