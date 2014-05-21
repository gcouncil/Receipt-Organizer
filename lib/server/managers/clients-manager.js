module.exports = function(connection) {

  var ClientsManager = {
    create: function(callback) {
      var counter;
      connection.query('SELECT NEXTVAL(\'client_id_seq\');', function(err, results) {
        if (err) { callback(err); }
        counter = results.rows[0].nextval;

        counter = counter % Math.pow(2, 48);

        var hex = counter.toString(16);
        // Left pad hex with zeros out to 12 hex characters (6 bytes, 48 bits)
        while(hex.length < 12) { hex = '0' + hex; }

        var buffer = new Buffer(hex, 'hex');

        // Convert buffer into an array of bytes
        var bytes = buffer.toJSON();

        callback(null, bytes);
      });
    }
  };

  return ClientsManager;
};
