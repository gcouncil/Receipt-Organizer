var padding = ':' + new Array(2049).join(' ') + '\n';

module.exports = function(manager) {
  var ItemsHandler = {
    stream: function(req, res, next) {
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
      }, 15e3);

      res.on('close', function() {
        clearInterval(heartbeat);
      });

      // Setup manager
      var lastEventId = Number(req.get('Last-Event-Id') || req.query.lastEventId) || 0;
      var stream = manager.stream(lastEventId, { user: req.user.id });

      stream.on('data', function(event) {
        res.write('id: ' + event.serial + '\n');
        res.write('data: ' + JSON.stringify(event.toJSON()) + '\n\n');
      });
    }
  };
  return ItemsHandler;
};

