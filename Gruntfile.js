module.exports = function(grunt) {
  grunt.initConfig({});

  var debug = true;

  grunt.loadNpmTasks('grunt-hub');
  grunt.config('hub', {
    all: {
      src: ['*/Gruntfile.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.config('connect', {
    dev: {
      options: {
        port: 8000,
        base: './client/build',
        middleware: [require('./server')]
      }
    },
    e2e: {
      options: {
        port: 9000,
        base: './client/build',
        middleware: [require('./server')]
      }
    }
  });

  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.config('protractor', {
    all: {
      options: {
        configFile: 'e2e.conf.js'
      }
    }
  });

  grunt.registerTask('build', ['hub:all:build']);
  grunt.registerTask('test', ['hub:all:test', 'connect:e2e', 'protractor']);
  grunt.registerTask('development', ['connect:dev', 'hub:all:development']);

  grunt.registerTask('default', ['hub:all:build']);
};
