var passport = require('passport');

module.exports = function(app, handlers, config) {

  app.get('/receipts', handlers.receipts.index);
  app.post('/receipts', handlers.receipts.create);
  app.put('/receipts/:receipt', handlers.receipts.update);
  app.del('/receipts/:receipt', handlers.receipts.destroy);

  app.post('/users', handlers.users.create);

  app.post('/login',
    passport.authenticate('local', { session: false} ),
    function(req, res) {
      res.send('OK');
    }
  );
};
