var padding = ':' + new Array(2049).join(' ') + '\n';

module.exports = function(manager) {
  var ItemsHandler = {
    stream: function(req, res, next) {
      res.on('close', function() {
        console.log('Cleanup event stream');
        if (heartbeat) { clearInterval(heartbeat); }
        if (stream) { stream.close(); }
      });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write('\n');

      res.write(padding);
      res.write('retry: 2000\n\n');

      // Setup heartbeat
      var heartbeat = setInterval(function() {
        res.write(': heartbeat\n\n');

        // Prevent latency due to compression
        res.flush();
      }, 15e3);


      // Setup manager
      var lastEventId = Number(req.get('Last-Event-Id') || req.query.lastEventId) || 0;
      var stream = manager.stream(lastEventId, { user: req.user.id });

      stream.on('data', function(event) {
        res.write('id: ' + event.serial + '\n');
        res.write('data: ' + JSON.stringify(event.toJSON()) + '\n\n');

        // Prevent latency due to compression
        res.flush();
      });

      stream.on('error', function() {
        res.end();
      });
    }
  };
  return ItemsHandler;
};

