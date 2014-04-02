var passport = require('passport');

module.exports = function(app, handlers, config) {

  function authenticateWithToken(callback) {
    return passport.authenticate('basic', { session: false } ),
    function(req, res) {
      if (req.user) {
        res.send(req.user);
      } else {
        res.send(403);
      }
    };
  }

  app.get('/receipts', authenticateWithToken(handlers.receipts.index));
  app.post('/receipts', handlers.receipts.create);
  app.put('/receipts/:receipt', handlers.receipts.update);
  app.del('/receipts/:receipt', handlers.receipts.destroy);

  app.get('/images', handlers.images.index);
  app.get('/images/:image', handlers.images.show);
  app.post('/images', handlers.images.create);
  app.del('/images/:image', handlers.images.destroy);

  app.post('/login',
    passport.authenticate('local', { session: false} ),
    function(req, res) {
      res.send('OK');
    }
  );
  app.post('/users', handlers.users.create);

};
