module.exports = function(grunt) {
  grunt.initConfig({});

  var debug = true;

  grunt.loadNpmTasks('grunt-hub');
  grunt.config('hub', {
    build: {
      src: ['client/Gruntfile.js'],
      tasks: ['build']
    },
    test: {
      src: ['client/Gruntfile.js'],
      tasks: ['test']
    },
    development: {
      src: ['client/Gruntfile.js'],
      tasks: ['development']
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

  grunt.registerTask('build', ['copy', 'browserify', 'less']);

  grunt.registerTask('test', ['hub:test']);

  grunt.registerTask('default', ['hub:build']);
  grunt.registerTask('development', ['connect:dev', 'hub:development']);
};
