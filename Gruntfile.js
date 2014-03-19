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
      files: ['app/**/*.js', 'app/**/*.html'],
      tasks: ['browserify']
    },
    less: {
      files: ['app/**/*.less'],
      tasks: ['less']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.config('connect', {
    e2e: {
      options: {
        port: 9000,
        base: 'build'
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
  grunt.registerTask('test:e2e', ['browserify:scripts', 'connect:e2e', 'protractor']);

  grunt.registerTask('default', ['build']);
};
