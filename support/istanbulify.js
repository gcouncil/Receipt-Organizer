var istanbul = require('istanbul');
var through = require('through');

var instrumenter = new istanbul.Instrumenter();

module.exports = function(file) {
  file = require('fs').realpathSync(file);
  file = require('path').relative(process.cwd(), file);
  var instrument = /^lib.*\.js$/.test(file);
  var buffers = [];

  function write(buffer) {
    if (!instrument) { return this.queue(buffer); }

    buffers.push(buffer);
  }

  function end() {
    if (instrument) {
      var src = Buffer.concat(buffers);
      var dest = instrumenter.instrumentSync(src.toString('utf-8'), file);
      this.queue(dest);
    }

    this.queue(null);
  }

  return through(write, end);
};
