var _ = require('lodash');
var async = require('async');

module.exports = function(services, managers, actions) {
  var AWS = services.aws;
  var sqs = new AWS.SQS();

  var workers = [{
    name: 'formxtra',
    concurrency: 1,
    fn: require('./formxtra-worker')(managers, actions)
  }];

  function process(worker) {
    function next() {
      var request = sqs.receiveMessage({
        QueueUrl: worker.url,
        WaitTimeSeconds: 20
      }, function(err, data) {
        if (timeout) { clearTimeout(timeout); }
        if (err) {
          console.warn('SQS Error, retry in 5 seconds');
          return setTimeout(next, 5e3);
        }
        if (!data.Messages) { return next(); }

        async.each(data.Messages, function(message, callback) {
          async.waterfall([
            function parse(callback) {
              try {
                var data = JSON.parse(message.Body);
                callback(null, data);
              } catch(e) {
                callback(e);
              }
            },
            function process(data, callback) {
              console.log('PROCESSING ' + message.Body);
              worker.fn(data, function(err) { callback(err); });
            },
            function(callback) {
              sqs.deleteMessage({
                QueueUrl: worker.url,
                ReceiptHandle: message.ReceiptHandle
              }, callback);
            }
          ], function(err) {
            if (err) {
              console.warn('Error processing message: ' + err);
            } else {
              console.log('DONE PROCESSING ' + message.Body);
            }

            next();
          });
        });
      });

      var timeout = setTimeout(function() {
        console.log('SQS Request Timed Out... Canceling');
        request.abort();
      }, 25e3);
    }

    sqs.getQueueUrl({
      QueueName: services.config.aws.namespace + worker.name
    }, function(err, result) {
      if (err) {
        console.warn('Failed to get SQS QueueUrl: ' + err);
        setTimeout(function() {
          process(worker);
        }, 10e3);
        return;
      }

      worker.url = result.QueueUrl;

      console.log('Starting ' + worker.concurrency + ' workers for ' + worker.url);
      _.times(worker.concurrency, next);
    });
  }

  _.each(workers, function(worker) {
    // Start Workers
    process(worker);
  });

  function push(queue, message, callback) {
    var worker = _.find(workers, { name: queue });

    if (!worker.url) { return callback(new Error('Worker not yet connected')); }

    var data = JSON.stringify(message);
    console.log('QUEUEING ' + data);

    sqs.sendMessage({
      MessageBody: data,
      QueueUrl: worker.url
    }, callback);
  }

  return {
    push: push
  };
};
