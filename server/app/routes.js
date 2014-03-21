module.exports = function(app, handlers, config) {

  app.get('/receipts', handlers.receipts.index);
  app.post('/receipts', handlers.receipts.create);

};
