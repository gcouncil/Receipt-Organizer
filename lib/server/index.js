var express = require('express');
var app = express();

function stagingBasicAuth(req, res, next) {
  if (process.env.BASICAUTH_USER) {
    var user = require('basic-auth')(req);
    if ( user &&
         user.name === process.env.BASICAUTH_USER &&
         user.pass === process.env.BASICAUTH_PASS ) {
      next();
    } else {
      res.set('WWW-Authenticate', 'Basic realm="staging"');
      res.send(401);
    }
  } else {
    next();
  }
}

app.use(require('morgan')());
app.all('*', stagingBasicAuth, express.static(__dirname + '/../../build'));

app.api = new (require('./api'))();
app.use('/api', app.api.handler);

module.exports = app;

if(require.main === module) {
  var port = process.env.PORT || 8000;
  require('http').createServer(app).listen(port, function() {
    console.log('Server listening on ' + port);
  });
}
