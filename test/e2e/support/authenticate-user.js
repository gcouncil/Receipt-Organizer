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

module.exports = {
  loginUser: loginUser
};
