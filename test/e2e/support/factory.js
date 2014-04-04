var Q = require('q');
var _ = require('lodash');

function wrap(fn, scope) {
  return function() {
    var args = arguments;
    return browser.call(function() {
      return Q.nfapply(fn.bind(scope), args);
    });
  };
}

function wrapManager(manager) {
  return _.transform(manager, function(result, fn, key) {
    if (_.isFunction(fn)) {
      result[key] = wrap(fn, manager);
    }
  });
}

module.exports = function(managers) {
  return _.mapValues(managers, wrapManager);
};
