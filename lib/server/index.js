var express = require('express');
var app = express();

if (process.env.BASICAUTH_USER) {
  app.use(function(req, res, next) {
    var user = require('basic-auth')(req);
    if ( user &&
         user.name === process.env.BASICAUTH_USER &&
         user.pass === process.env.BASICAUTH_PASS ) {
      next();
    } else {
      res.set('WWW-Authenticate', 'Basic realm="staging"');
      res.send(401);
    }
  });
}

app.use(require('morgan')());
app.use(express.static(__dirname + '/../../build'));

app.api = new (require('./api'))();
app.use('/api', app.api.handler);

module.exports = app;

if(require.main === module) {
  var port = process.env.PORT || 8000;
  require('http').createServer(app).listen(port, function() {
    console.log('Server listening on ' + port);
  });
}
