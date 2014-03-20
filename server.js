var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.static(__dirname + '/client/build'));

var Application = require('./server/app');
app.use('/api', new Application().handler);

module.exports = app;

if(require.main === module) {
  var port = process.env.PORT || 3000;
  require('http').createServer(app).listen(port, function() {
    console.log('Server listening on ' + port);
  });
}
