var chai = require('chai');
chai.use(require('chai-as-promised'));

before(function(done) {
  process.env.NODE_ENV = 'test';
  var app = require('../../server');
  this.server = require('http').createServer(app);
  this.server.listen(9000, done);
});

after(function(done) {
  this.server.close(done);
});

module.exports = {
  rootUrl: 'http://localhost:9000/',
  expect: chai.expect
};
