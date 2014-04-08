module.exports = function(manager) {
  var ImagesHandler = {

    show: function(req, res, next) {
      manager.fetch(req.params.image, { user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.send(results);
      });
    },

    display: function(req, res, next) {
      manager.imageUrl(req.params.image, { user: req.user.id }, function(err, url) {
        if (err) { return next(err); }
        res.redirect(url);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, { user: req.user.id }, function(err, image) {
        if (err) { return next(err); }

        res.send(201, image);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.image, { user: req.user.id }, function(err, image) {
        if (err) {
          if (err === 401) {
            return(res.send(401, 'Unauthorized'));
          } else {
            return next(err);
          }
        }

        res.send(200);
      });
    }
  };
  return ImagesHandler;
};
