var passport = require('passport');

module.exports = function(app, handlers, config) {

  var auth = passport.authenticate('bearer', { session: false });

  app.post('/receipts', auth, handlers.receipts.create);
  app.get('/receipts', auth, handlers.receipts.index);
  app.put('/receipts/:receipt', auth, handlers.receipts.update);
  app.delete('/receipts/:receipt', auth, handlers.receipts.destroy);

  app.get('/images/:image', auth, handlers.images.show);
  app.put('/images/:image', auth, handlers.images.create);
  app.delete('/images/:image', auth, handlers.images.destroy);

  app.get('/tags', auth, handlers.tags.index);
  app.post('/tags', auth, handlers.tags.create);
  app.put('/tags/:tag', auth, handlers.tags.update);
  app.delete('/tags/:tag', auth, handlers.tags.destroy);

  app.post('/login',
    passport.authenticate('local', { session: false }),
    function(req, res) {
      res.send(req.user);
    }
  );

  app.post('/users', handlers.users.create);
};
