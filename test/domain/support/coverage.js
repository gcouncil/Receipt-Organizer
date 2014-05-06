var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();

function normalizeFile(file) {
  file = require('fs').realpathSync(file);
  file = require('path').relative(process.cwd(), file);
  return file;
}

istanbul.hook.hookRequire(function(file) {
  file = normalizeFile(file);
  return /^lib/.test(file);
}, function(code, file) {
  file = normalizeFile(file);
  return instrumenter.instrumentSync(code, file);
});

after(function() {
  var collector = new istanbul.Collector();
  collector.add(global.__coverage__);
  istanbul.Report.create('lcov', { dir: 'coverage/domain' }).writeReport(collector, true);
  istanbul.Report.create('json', { dir: 'coverage/domain' }).writeReport(collector, true);
});
