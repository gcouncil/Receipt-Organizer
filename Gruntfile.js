module.exports = function(grunt) {
  grunt.initConfig({});

  var debug = true;

  grunt.loadNpmTasks('grunt-hub');
  grunt.config('hub', {
    all: {
      src: ['*/Gruntfile.js']
    }
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.config('concurrent', {
    dev: ['nodemon:dev', 'hub:all:development']
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.config('nodemon', {
    dev: {
      script: './server',
      options: {
        watch: ['./server'],
        ignore: ['./server/node_modules/**'],
        env: {
          PORT: 8000,
          NODE_ENV: 'development'
        }
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
  grunt.registerTask('test', ['hub:all:test', 'protractor']);
  grunt.registerTask('development', ['nodemon:dev', 'hub:all:development']);

  grunt.registerTask('default', ['hub:all:build']);
};
