var protractor = require('protractor');

function createAndLoginUser(api, user) {
  user = user || {
    email: 'test@example.com',
    password: 'password'
  };

  var userPromise = browser.driver.controlFlow().execute(function() {
    return protractor.promise.checkedNodeCall(function(done) {
      return api.managers.users.create(user, done);
    });
  });

  browser.call(function(user) {
    browser.executeScript(function(user) {
      /* global angular */
      var injector = angular.element(document.body).injector();
      injector.get('authentication').setUser(user);
      window.history.back();
    }, user);
  }, null, userPromise);

}

module.exports = {
  createAndLoginUser: createAndLoginUser
};
