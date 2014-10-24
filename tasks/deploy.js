module.exports = function(grunt) {
  var fs = require('fs');
  var exec = require('child_process').exec;
  var spawn = require('child_process').spawn;

  var AWS = require('../lib/server/services/aws')(grunt.config('appconfig'));
  var async = require('async');
  var moment = require('moment');

  grunt.registerTask('deploy', function() {
    var done = this.async();
    var s3 = new AWS.S3();
    var eb = new AWS.ElasticBeanstalk();

    var ctx = {};

    async.series([
      function build(callback) {
        grunt.util.spawn({ grunt: true, args: ['build', '--env=production'], opts: { stdio: 'inherit' } }, callback);
      },
      function version(callback) {
        grunt.log.ok('Determining version');
        exec('git describe --always --abbr=40 --dirty', function(err, version) {
          ctx.version = moment.utc().format('YYYYMMDDTHHmmss[Z]') + '-' + version.trim();
          callback(err);
        });
      },
      function zip(callback) {
        grunt.log.ok('Creating Zip of sources');

        grunt.file.mkdir('tmp');

        var cmd = 'git ls-files | zip -X -y -r tmp/deploy.zip -@ .ebextensions build/index.html build/appcache.manifest build/app build/assets node_modules/epson-receipts';
        var child = spawn('sh', ['-c', cmd], { stdio: ['ignore', 'ignore', process.stderr] });
        child.on('close', function(code) {
          if (code !== 0) { return callback('Zip process exitied with code: ' + code); }
          fs.readFile('tmp/deploy.zip', function(err, body) {
            ctx.body = body;
            callback(err);
          });
        });
      },
      function upload(callback) {
        grunt.log.ok('Uploading source to S3');
        s3.putObject({
          Bucket: 'epsonreceipts-source',
          Key: ctx.version + '.zip',
          Body: ctx.body
        }, callback);
      },
      function createVersion(callback) {
        grunt.log.ok('Creating Elastic Beanstalk App Version');
        eb.createApplicationVersion({
          ApplicationName: 'epson-receipts',
          VersionLabel: ctx.version,
          SourceBundle: {
            S3Bucket: 'epsonreceipts-source',
            S3Key: ctx.version + '.zip'
          }
        }, callback);
      },
      function updateEnvironment(callback) {
        grunt.log.ok('Updating Elastic Beanstalk Environment');
        eb.updateEnvironment({
          EnvironmentName: 'epson-receipts-env',
          VersionLabel: ctx.version
        }, callback);
      }
    ], done);
  });
};
