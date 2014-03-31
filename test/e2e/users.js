var helpers = require('./test-helper');
var expect = helpers.expect;
var protractor = require('protractor');

function SignupPage() {
  this.get = function() {
    var url = helpers.rootUrl + '/#/signup';
   browser.get(url);
  };

  this.signupForm = $('form');
  this.flashDiv = $('.alert');
};

function queryUsers(manager, options) {
  return browser.driver.controlFlow().execute(function() {
    return protractor.promise.checkedNodeCall(function(done) {
      manager.query(options || {}, done);
    });
  });
}

describe('Sign up', function() {
  beforeEach(function() {
    this.page = new SignupPage();
    this.page.get();
  });

  it('should be possible to sign up for an account', function() {
    var emailField = this.page.signupForm.element(by.model('user.email'));
    emailField.sendKeys('test@example.com');

    var passwordField = this.page.signupForm.element(by.model('user.password'));
    passwordField.sendKeys('password');

    var passwordConfirmationField = this.page.signupForm.element(by.model('user.passwordConfirmation'));
    passwordConfirmationField.sendKeys('password');

    this.page.signupForm.element(by.buttonText('Sign Up!')).click();
    var redirect = browser.getCurrentUrl();
    expect(redirect).to.eventually.equal(helpers.rootUrl + '/#/receipts/thumbnails');

    expect(this.page.flashDiv.getText()).to.eventually.contain('Successfully signed up!');
  });

});
