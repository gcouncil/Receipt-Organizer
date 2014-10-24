module.exports = function(grunt) {
  var debug = grunt.option('env') !== 'production';

  grunt.initConfig({
    appconfig: require('config')
  });

  grunt.config('env.' + grunt.option('env'), true);

  // BUILD TASKS

  grunt.config('browserify', {
    options: {
      debug: debug,
      watch: true,
      coverage: grunt.option('coverage')
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
        { src: 'lib/client/index.html', dest: 'build/app/index.html' },
        { src: 'lib/static/index.html', dest: 'build/index.html' },
        { src: 'lib/client/appcache.manifest', dest: 'build/appcache.manifest' }
      ],
      options: {
        process: function(content, path) {
          return grunt.template.process(content);
        }
      }
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
    dynamsoft: {
      files: [{
        expand: true,
        cwd: './vendor/dynamsoft',
        src: '*',
        dest: 'build/assets/dynamsoft'
      }]
    },
    staticImages: {
      files: [{
        expand: true,
        cwd: './lib/static/img',
        src: '*',
        dest: 'build/assets/img'
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
        dest: 'tmp/assets/styles.css'
      }],
      options: {
        paths: [
          './bower_components/bootstrap/less',
          './bower_components/font-awesome/less',
          './bower_components/angular-motion/dist',
          './bower_components/selectize/dist/less',
          './bower_components/animate.css'
        ],
        sourceMap: debug,
        outputSourceFiles: true
      }
    },
    staticStyles: {
      files: [{
        src: [
          'lib/static/styles.less'
        ],
        dest: 'tmp/assets/static-styles.css'
      }],
      options: {
        paths: [
          './bower_components/bootstrap/less',
          './bower_components/font-awesome/less'
        ],
        sourceMap: debug,
        outputSourceFiles: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.config('autoprefixer', {
    styles: {
      src: 'tmp/assets/styles.css',
      dest: 'build/assets/styles.css'
    },
    staticStyles: {
      src: 'tmp/assets/static-styles.css',
      dest: 'build/assets/static-styles.css'
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
    },
    domain: {
      src: ['test/domain/**/*_test.js']
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

  // Uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {
    scripts: {
      src: 'build/assets/index.js',
      dest: 'build/assets/index.min.js'
    },
    options: {
      mangle: false
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
      files: ['lib/client/index.html', 'lib/static/index.html', 'lib/client/appcache.manifest'],
      tasks: ['copy:html']
    },
    less: {
      files: ['lib/client/**/*.less', 'lib/static/**/*.less'],
      tasks: ['less', 'autoprefixer']
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
    },
    domainTest: {
      files: ['test/domain/**/*.js'],
      tasks: ['test:domain']
    }
  });

  grunt.loadTasks('./tasks');

  var buildTasks = ['copy', 'browserify:scripts', 'less', 'autoprefixer'];
  if (grunt.config('env.production')) { buildTasks.push('uglify'); }
  grunt.registerTask('build', buildTasks);

  grunt.registerTask('test:client', ['browserify:test', 'karma:run']);
  grunt.registerTask('test:server', ['mochaTest:server']);
  grunt.registerTask('test:domain', ['mochaTest:domain']);
  grunt.registerTask('test:unit', ['test:client', 'test:server', 'test:domain']);
  grunt.registerTask('test:e2e', ['build', 'protractor']);
  grunt.registerTask('test', ['test:unit', 'test:e2e', 'coverage']);

  grunt.registerTask('development', ['build', 'browserify:test', 'karma:watch:start', 'concurrent:development']);

  grunt.registerTask('default', ['build']);
};
