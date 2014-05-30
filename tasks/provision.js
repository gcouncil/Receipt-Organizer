var async = require('async');

module.exports = function(grunt) {
  grunt.registerTask('provision', function() {
    var appconfig = grunt.config('appconfig');
    var AWS = require('../lib/server/services/aws')(appconfig);

    var s3 = new AWS.S3();
    var sqs = new AWS.SQS();
    var done = this.async();

    grunt.log.ok('Ensuring existence of S3 bucket and SQS queue');

    var bucket = appconfig.aws.namespace + appconfig.storage.receiptBucket;

    function ensureS3(callback) {
      s3.headBucket({
        Bucket: bucket
      }, function(err) {
        if (!err) {
          grunt.log.ok('S3 bucket exists');
          return callback();
        }

        async.series([
          function(callback) {
            grunt.log.ok('Creating bucket: ' + bucket);
            s3.createBucket({
              Bucket: bucket
            }, callback);
          },
          function(callback) {
            grunt.log.ok('Configuring CORS');
            s3.putBucketCors({
              Bucket: bucket,
              CORSConfiguration: {
                CORSRules: [{
                  AllowedOrigins: ['*'],
                  AllowedMethods: ['GET'],
                  AllowedHeaders: ['Authorization', 'If-Modified-Since', 'Accept', 'Origin'],
                  MaxAgeSeconds: 3000
                }]
              }
            }, callback);
          },
          function(callback) {
            grunt.log.ok('S3 bucket provisioned');
            callback();
          }
        ], callback);
      });
    }

    var queue = appconfig.aws.namespace + 'formxtra';
    function ensureSQS(callback) {
      sqs.getQueueUrl({
        QueueName: queue
      }, function(err) {
        if (!err) {
          grunt.log.ok('SQS queue exists');
          return callback();
        }

        grunt.log.ok('Creating SQS queue: ' + queue);
        sqs.createQueue({
          QueueName: queue
        }, function(err) {
          if (!err) { grunt.log.ok('SQS queue provisioned'); }
          callback(err);
        });
      });
    }

    async.series([
      ensureS3,
      ensureSQS
    ], done);
  });
};
