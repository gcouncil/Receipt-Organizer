var istanbul = require('istanbul');
var instrumenter = new istanbul.Instrumenter();
var collector = new istanbul.Collector();

var navigate = browser.driver.navigate;
browser.driver.navigate = function() {
  browser.executeScript('return window.__coverage__').then(function(coverage) {
    if (coverage) { collector.add(coverage); }
  });

  return navigate.apply(this, arguments);
};

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
  collector.add(global.__coverage__);
  istanbul.Report.create('lcov', { dir: 'coverage/e2e' }).writeReport(collector, true);
  istanbul.Report.create('json', { dir: 'coverage/e2e' }).writeReport(collector, true);
});
