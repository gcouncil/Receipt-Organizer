module.exports = function(app, handlers, config) {

  app.get('/receipts', handlers.receipts.index);
  app.post('/receipts', handlers.receipts.create);
  app.put('/receipts/:receipt', handlers.receipts.update);
  app.del('/receipts/:receipt', handlers.receipts.destroy);

  app.get('/images', handlers.images.index);
  app.get('/images/:image', handlers.images.show);
  app.post('/images', handlers.images.create);
  app.del('/images/:image', handlers.images.destroy);

};
