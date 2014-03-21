module.exports = function() {
  var ReceiptsHandler = {
    index: function(req, res, next) {
      res.send(200);
    }

  };
  return ReceiptsHandler;
};
