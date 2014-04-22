module.exports = function(manager) {
  var TagsHandler = {
    index: function(req, res, next) {
      manager.query({ user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.send(200, results);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, { user: req.user.id }, function(err, tag) {
        if (err) { return next(err); }

        res.send(201, tag);
      });
    },

    update: function(req, res, next) {
      manager.update(req.params.tag, req.body, {user: req.user.id }, function(err, tag) {
        if (err) {
          if (err === 401) {
            res.send(401, 'Unauthorized');
          } else {
            return next(err);
          }
        }

        res.send(200, tag);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.tag, { user: req.user.id }, function(err, tag) {
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
  return TagsHandler;
};