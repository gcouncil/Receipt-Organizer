var passport = require('passport');

module.exports = function(app, handlers, config) {

  var auth = passport.authenticate('bearer', { session: false });

  app.get('/events', auth, handlers.events.stream);

  app.post('/reports', auth, handlers.reports.create);
  app.get('/reports', auth, handlers.reports.index);
  app.put('/reports/:report', auth, handlers.reports.update);
  app.delete('/reports/:report', auth, handlers.reports.destroy);

  app.post('/items', auth, handlers.items.create);
  app.get('/items', auth, handlers.items.index);
  app.get('/items/:item', auth, handlers.items.show);
  app.put('/items/:item', auth, handlers.items.update);
  app.delete('/items/:item', auth, handlers.items.destroy);

  app.get('/images/:image', auth, handlers.images.show);
  app.put('/images/:image', auth, handlers.images.create);
  app.delete('/images/:image', auth, handlers.images.destroy);

  app.get('/folders', auth, handlers.folders.index);
  app.post('/folders', auth, handlers.folders.create);
  app.put('/folders/:folder', auth, handlers.folders.update);
  app.delete('/folders/:folder', auth, handlers.folders.destroy);

  app.post('/clients', handlers.clients.create);

  app.post('/login',
    passport.authenticate('local', { session: false }),
    function(req, res) {
      res.send(req.user);
    }
  );

  app.post('/users', handlers.users.create);
};
