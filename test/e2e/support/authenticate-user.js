var protractor = require('protractor');
function loginUser(user) {
  browser.call(function(user) {
    browser.executeScript(function(user) {
      /* global angular */
      var injector = angular.element(document.body).injector();
      injector.get('authentication').setUser(user);
      window.history.back();
    }, user);
  }, null, user);
}

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

  loginUser(user);

  return userPromise;
}

module.exports = {
  loginUser: loginUser,
  createAndLoginUser: createAndLoginUser
};
