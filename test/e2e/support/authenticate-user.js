var protractor = require('protractor');

function buildUser(manager, user) {
  return browser.driver.controlFlow().execute(function() {
    return protractor.promise.checkedNodeCall(function(done) {
      return manager.create(user, done);
    });
  });
}

function authenticateUser() {
  var usersManager = this.api.managers.users;
  var token = buildUser(usersManager, {
    email: 'test@example.com',
    password: 'password'
  });

  browser.driver.controlFlow().exec(window.localStorage.setItem('currentUser', token));
};

module.exports = authenticateUser;
