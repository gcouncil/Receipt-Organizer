var Q = require('q');
var _ = require('lodash');
/* jshint unused: false */
var protractor = require('protractor');

function wrap(fn, scope) {
  return function() {
    var promise = Q.nfapply(fn.bind(scope), arguments);
    return browser.call(function() { return promise; });
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
