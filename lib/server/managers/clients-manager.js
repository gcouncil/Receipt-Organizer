module.exports = function(connection) {

  var ClientsManager = {
    create: function(callback) {
      var counter;
      connection.query('SELECT NEXTVAL(\'client_id_seq\');', function(err, results) {
        if (err) { callback(err); }
        counter = results.rows[0].nextval;

        counter = counter % Math.pow(2, 48);
        var buffer = new Buffer(counter.toString(16), 'hex');
        callback(null, buffer.toJSON());
      });
    }
  };

  return ClientsManager;
};
