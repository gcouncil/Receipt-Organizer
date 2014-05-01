var async = require('async');

var browserify = require('browserify');
var watchify = require('watchify');

module.exports = function(grunt) {
  grunt.registerMultiTask('browserify', function() {
    var done = this.async();
    var options = this.options();

    async.each(this.files, function(file, callback) {
      var b, timeout;

      function bundle() {
        if (timeout) {
          clearTimeout(timeout);
        }
        grunt.log.ok('browserify ' + file.src);
        b.bundle(options, function(err, src) {
          if (err) {
            grunt.log.warn(err);
            grunt.log.warn('browserify failed, will retry in 10 seconds to check for new files');
            timeout = setTimeout(bundle, 10e3); // Retry in 10 seconds
          } else {
            grunt.file.write(file.dest, src);
            grunt.log.ok('Wrote ' + file.dest);
          }

          callback(err);
          callback = function() {}; // Only call the callback the first time
        });
      }

      b = (options.watch ? watchify : browserify)(file.src);
      b.on('update', bundle);

      if (options.coverage) {
        b.transform({ global: true }, './support/istanbulify');
      }

      bundle();
    }, done);
  });
};
