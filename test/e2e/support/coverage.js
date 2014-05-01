var istanbul = require('istanbul');

var collector = new istanbul.Collector();

var navigate = browser.driver.navigate;
browser.driver.navigate = function() {
  browser.executeScript('return window.__coverage__').then(function(coverage) {
    if (coverage) { collector.add(coverage); }
  });

  return navigate.apply(this, arguments);
};

after(function() {
  istanbul.Report.create('lcov', { dir: 'coverage/e2e' }).writeReport(collector, true);
});
