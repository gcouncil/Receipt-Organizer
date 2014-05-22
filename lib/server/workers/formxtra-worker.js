module.exports = function(managers, actions) {
  return function(message, callback) {
    actions.recognize(message.receipt, true, callback);
  };
};
