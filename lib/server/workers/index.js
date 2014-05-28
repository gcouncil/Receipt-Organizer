var _ = require('lodash');
var async = require('async');

module.exports = function(services, managers, actions) {
  var AWS = services.aws;
  var sqs = new AWS.SQS();

  var workers = [{
    name: 'formxtra',
    concurrency: 4,
    fn: require('./formxtra-worker')(managers, actions)
  }];

  function process(worker) {
    function next() {
      sqs.receiveMessage({
        QueueUrl: worker.url,
        WaitTimeSeconds: 20
      }, function(err, data) {
        if (err) { return next(); }
        if (!data.Messages) { return next(); }

        async.each(data.Messages, function(message, callback) {
          try {
            var data = JSON.parse(message.Body);

            console.log('Processing message: ' + message.Body);
            worker.fn(data, function(err) {
              if (err) {
                console.warn(err);
                return callback();
              }

              sqs.deleteMessage({
                QueueUrl: worker.url,
                ReceiptHandle: message.ReceiptHandle
              }, callback);
            });
          } catch(e) {
            console.warn('Error processing message: ' + e);
            callback();
          }
        }, next);
      });
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
    console.log('Queuing message: ' + data);

    sqs.sendMessage({
      MessageBody: data,
      QueueUrl: worker.url
    }, callback);
  }

  return {
    push: push
  };
};
