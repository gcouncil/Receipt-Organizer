var passport = require('passport');

module.exports = function(app, handlers, config) {

  var auth = passport.authenticate('bearer', { session: false });

  app.post('/expenses', auth, handlers.expenses.create);
  app.get('/expenses', auth, handlers.expenses.index);
  app.put('/expenses/:expense', auth, handlers.expenses.update);
  app.delete('/expenses/:expense', auth, handlers.expenses.destroy);

  app.get('/images/:image', auth, handlers.images.show);
  app.put('/images/:image', auth, handlers.images.create);
  app.delete('/images/:image', auth, handlers.images.destroy);

  app.get('/folders', auth, handlers.folders.index);
  app.post('/folders', auth, handlers.folders.create);
  app.put('/folders/:folder', auth, handlers.folders.update);
  app.delete('/folders/:folder', auth, handlers.folders.destroy);

  app.post('/login',
    passport.authenticate('local', { session: false }),
    function(req, res) {
      res.send(req.user);
    }
  );

  app.post('/users', handlers.users.create);
};
