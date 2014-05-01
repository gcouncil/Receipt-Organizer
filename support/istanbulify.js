var istanbul = require('istanbul');
var through = require('through');

var instrumenter = new istanbul.Instrumenter();

module.exports = function(file) {
  var instrument = /epson-receipts\/(node_modules\/epson-receipts|lib)/.test(file);
  var buffers = [];

  function write(buffer) {
    if (!instrument) { return this.queue(buffer); }

    buffers.push(buffer);
  }

  function end() {
    if (instrument) {
      var src = Buffer.concat(buffers);
      var dest = instrumenter.instrumentSync(src, file);
      this.queue(dest);
    }

    this.queue(null);
  }

  return through(write, end);
};
