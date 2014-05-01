var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();

istanbul.hook.hookRequire(function(file) {
  return /epson-receipts\/(node_modules\/epson-receipts|lib)/.test(file);
}, function(code, file) {
  console.log(file);
  return instrumenter.instrumentSync(code, file);
});

after(function() {
  var collector = new istanbul.Collector();
  collector.add(global.__coverage__);
  istanbul.Report.create('lcov', { dir: 'coverage/server' }).writeReport(collector, true);
});
