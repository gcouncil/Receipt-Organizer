module.exports = function() {
  var counter = counter || 0;

  var ClientsManager = {
    create: function(callback) {
      counter = (counter + 1) % 2^48;
      var buffer = new Buffer(counter.toString(16), 'hex');
      callback(null, buffer.toJSON());
    }
  };

  return ClientsManager;
};
