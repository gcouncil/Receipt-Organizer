var padding = ':' + new Array(2049).join(' ') + '\n';

module.exports = function(manager) {
  var ItemsHandler = {
    stream: function(req, res, next) {
      res.set('Cache-Control', 'no-cache');
      res.type('text/event-stream');

      // Padding to support event source polyfill
      // see: https://github.com/Yaffle/EventSource#server-side-requirements
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
        res.write('event: ' + event.name + '\n');
        res.write('id: ' + event.serial + '\n');
        res.write('data: ' + JSON.stringify(event.data) + '\n\n');
      });
    }
  };
  return ItemsHandler;
};

