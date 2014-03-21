module.exports = function(grunt) {
  grunt.initConfig({});

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.config('mochaTest', {
    unit: {
      src: ['test/**/*_test.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    test: {
      files: ['app/**/*.js', 'test/**/*.js'],
      tasks: ['test']
    }
  });

  grunt.registerTask('build', []);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('development', ['watch']);
};
