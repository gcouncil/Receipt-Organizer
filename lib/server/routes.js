var passport = require('passport');

module.exports = function(app, handlers, config) {

  function authenticateWithToken(callback) {
    return passport.authenticate('basic', { session: false } ),
    function(req, res) {
      if (res.user) {
        res.send(req.user);
      } else {
        res.send(403);
      }
    };
  }

  app.get('/receipts', authenticateWithToken(handlers.receipts.index));
  app.post('/receipts', authenticateWithToken(handlers.receipts.create));
  app.put('/receipts/:receipt', authenticateWithToken(handlers.receipts.update));
  app.del('/receipts/:receipt', authenticateWithToken(handlers.receipts.destroy));
  app.del('/receipts/:receipt', authenticateWithToken(handlers.receipts.destroy));

  app.get('/images', authenticateWithToken(handlers.images.index));
  app.get('/images/:image', authenticateWithToken(handlers.images.show));
  app.post('/images', authenticateWithToken(handlers.images.create));
  app.del('/images/:image', authenticateWithToken(handlers.images.destroy));

  app.post('/login',
    passport.authenticate('local', { session: false} ),
    function(req, res) {
      res.send('OK');
    }
  );
  app.post('/users', handlers.users.create);

};
