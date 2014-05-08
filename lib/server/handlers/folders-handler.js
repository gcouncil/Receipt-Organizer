module.exports = function(manager) {
  var FoldersHandler = {
    index: function(req, res, next) {
      manager.query({ user: req.user.id }, function(err, results) {
        if (err) { return next(err); }

        res.send(200, results);
      });
    },

    create: function(req, res, next) {
      manager.create(req.body, { user: req.user.id }, function(err, folder) {
        if (err) { return next(err); }

        res.send(201, folder);
      });
    },

    update: function(req, res, next) {
      manager.update(req.params.folder, req.body, {user: req.user.id }, function(err, folder) {
        if (err) {
          if (err === 401) {
            res.send(401, 'Unauthorized');
          } else {
            return next(err);
          }
        }

        res.send(200, folder);
      });
    },

    destroy: function(req, res, next) {
      manager.destroy(req.params.folder, { user: req.user.id }, function(err, folder) {
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
  return FoldersHandler;
};
