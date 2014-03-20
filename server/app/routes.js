var express = require('express');

module.exports = function(app, handlers, config) {

  // REST

  app.get('/', function(req, res, next) {
    res.send('Hello, world!');
  });

}