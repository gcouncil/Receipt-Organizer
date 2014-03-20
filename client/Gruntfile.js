module.exports = function(grunt) {
  grunt.initConfig({});

  var debug = true;

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.config('copy', {
    html: {
      files: [
        { src: 'app/index.html', dest: 'build/index.html' }
      ]
    },
    fonts: {
      files: [{
        expand: true,
        cwd: './bower_components/font-awesome/fonts',
        src: '*',
        dest: 'build/fonts'
      }, {
        expand: true,
        cwd: './bower_components/bootstrap/fonts',
        src: '*',
        dest: 'build/fonts'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.config('browserify', {
    options: {
      debug: debug
    },

    scripts: {
      files: [
        { src: 'app/index.js', dest: 'build/index.js' }
      ]
    },

    test: {
      files: [
        { src: 'app/test.js', dest: 'build/test.js' }
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.config('less', {
    styles: {
      files: [
        { src: 'app/styles.less', dest: 'build/styles.css' }
      ],
      options: {
        paths: ['./bower_components/bootstrap/less', './bower_components/font-awesome/less'],
        dumpLineNumbers: debug ? 'all' : false,
        sourceMap: debug,
        outputSourceFiles: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    html: {
      files: ['app/index.html'],
      tasks: ['copy:html']
    },
    scripts: {
      files: ['app/**/*.js', 'app/**/*.html', 'libs/**/*.js'],
      tasks: ['browserify:scripts']
    },
    less: {
      files: ['app/**/*.less'],
      tasks: ['less']
    },
    test: {
      files: ['app/**/*.js', 'app/**/*.html'],
      tasks: ['browserify:test', 'karma:watch:run']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.config('connect', {
    dev: {
      options: {
        port: 8000,
        base: 'build'
      }
    },
    e2e: {
      options: {
        port: 9000,
        base: 'build'
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.config('karma', {
    options: {
      configFile: 'karma.conf.js',
    },

    run: {},

    watch: {
      options: {
        browsers: ['PhantomJS'],
        background: true,
        singleRun: false
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

  grunt.registerTask('test', ['test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['browserify:test', 'karma:run']);
  grunt.registerTask('test:e2e', ['browserify:scripts', 'connect:e2e', 'protractor']);

  grunt.registerTask('default', ['build']);
  grunt.registerTask('development', ['karma:watch:start', 'connect:dev', 'build', 'watch']);
};
