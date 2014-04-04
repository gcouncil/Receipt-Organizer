module.exports = function(grunt) {
  var exec = require('child_process').exec;
  var spawn = require('child_process').spawn;

  var AWS = require('aws-sdk');
  var async = require('async');
  var moment = require('moment');

  // TODO: Pull from some sort of config
  AWS.config.region = 'us-west-2';

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
          ctx.version = moment.utc().format('YYYYMMDDTHHmmss[Z]') + '-' + version;
          callback(err);
        });
      },
      function zip(callback) {
        grunt.log.ok('Creating ZIP of sources');

        var chunks = [];
        var child = spawn('sh', ['-c', 'zip -r - `git ls-files` .ebextensions build/index.html build/assets node_modules/epson-receipts'], { stdio: ['ignore', 'pipe', process.stderr] });
        child.stdio[1].on('data', function(chunk) { chunks.push(chunk); });
        child.stdio[1].on('error', callback);
        child.stdio[1].on('end', function() {
          ctx.body = Buffer.concat(chunks);
          callback();
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
        grunt.log.ok('Upadting Elastic Beanstalk Environment');
        eb.updateEnvironment({
          EnvironmentName: 'epson-receipts-env',
          VersionLabel: ctx.version
        }, callback);
      }
    ], done);
  });
};
