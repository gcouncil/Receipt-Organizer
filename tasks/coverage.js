var fs = require('fs');
var glob = require('glob');
var istanbul = require('istanbul');
var _ = require('lodash');

module.exports = function(grunt) {
  grunt.registerTask('coverage', function() {
    var collector = new istanbul.Collector();

    var files = glob.sync(__dirname + '/../coverage/**/coverage-final.json');
    _.each(files, function(file) {
      if (/all\/coverage-final\.json/.test(file)) { return; }

      console.log('Adding coverage from: ' + file);
      var coverage = JSON.parse(fs.readFileSync(file));
      collector.add(coverage);
    });

    istanbul.Report.create('lcov', { dir: __dirname + '/../coverage/all' }).writeReport(collector, true);
    istanbul.Report.create('json', { dir: __dirname + '/../coverage/all' }).writeReport(collector, true);
  });
};
