module.exports = function(grunt) {
  grunt.initConfig({
    appconfig: require('config')
  });

  var debug = grunt.option('env') !== 'production';

  // BUILD TASKS

  grunt.config('browserify', {
    options: {
      debug: debug,
      watch: true
    },

    scripts: {
      files: [
        { src: './lib/client/index.js', dest: 'build/assets/index.js' }
      ]
    },

    test: {
      files: [
        { src: './test/client/index.js', dest: 'build/test.js' }
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.config('copy', {
    html: {
      files: [
        { src: 'lib/client/index.html', dest: 'build/index.html' }
      ]
    },
    fonts: {
      files: [{
        expand: true,
        cwd: './bower_components/font-awesome/fonts',
        src: '*',
        dest: 'build/assets/fonts'
      }, {
        expand: true,
        cwd: './bower_components/bootstrap/fonts',
        src: '*',
        dest: 'build/assets/fonts'
      }]
    },
    images: {
      files: [{
        expand: true,
        cwd: './bower_components/select2',
        src: ['*.png', '*.gif'],
        dest: 'build/assets'
      }]
    }
  });


  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.config('less', {
    styles: {
      files: [{
        src: [
          'lib/client/styles.less'
        ],
        dest: 'build/assets/styles.css'
      }],
      options: {
        paths: [
          './bower_components/bootstrap/less',
          './bower_components/font-awesome/less',
          './bower_components/select2'
        ],
        dumpLineNumbers: debug ? 'all' : false,
        sourceMap: debug,
        outputSourceFiles: true
      }
    }
  });

  // TESTING TASKS

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.config('jshint', {
    options: {
      jshintrc: true
    },
    all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
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

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.config('mochaTest', {
    server: {
      src: ['test/server/**/*_test.js']
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

  // WATCH TASKS

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.config('concurrent', {
    options: {
      logConcurrentOutput: true
    },
    development: {
      tasks: ['watch', 'nodemon']
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.config('nodemon', {
    development: {
      script: './lib/server',
      options: {
        watch: ['./lib/server', './lib/domain'],
        env: {
          PORT: 8000,
          NODE_ENV: 'development'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    html: {
      files: ['lib/client/index.html'],
      tasks: ['copy:html']
    },
    less: {
      files: ['lib/client/**/*.less'],
      tasks: ['less']
    },
    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      tasks: ['jshint']
    },
    clientTest: {
      files: ['build/test.js'],
      tasks: ['karma:watch:run']
    },
    serverTest: {
      files: ['test/server/**/*.js', 'lib/server/**/*.js', 'lib/domain/**/*.js'],
      tasks: ['test:server']
    }
  });

  grunt.loadTasks('./tasks');

  grunt.registerTask('build', ['copy', 'browserify:scripts', 'less']);

  grunt.registerTask('test:client', ['browserify:test', 'karma:run']);
  grunt.registerTask('test:server', ['mochaTest:server']);
  grunt.registerTask('test:domain', []);
  grunt.registerTask('test:unit', ['test:client', 'test:server', 'test:domain']);
  grunt.registerTask('test:e2e', ['build', 'protractor']);
  grunt.registerTask('test', ['test:unit', 'test:e2e']);

  grunt.registerTask('development', ['build', 'browserify:test', 'karma:watch:start', 'concurrent:development']);

  grunt.registerTask('default', ['build']);
};
