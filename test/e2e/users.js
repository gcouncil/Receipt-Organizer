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
}

function LoginPage() {
  this.get = function() {
    var url = helpers.rootUrl + '/#/login';
    browser.get(url);
  };

  this.loginForm = $('form');
  this.flashDiv = $('.alert');
}

function buildUser(manager, user) {
  return browser.driver.controlFlow().execute(function() {
    return protractor.promise.checkedNodeCall(function(done) {
      manager.create(user, done);
    });
  });
}

function authenticateUser(manager, credentials) {
  return browser.driver.controlFlow().execute(function() {
    return protractor.promise.checkedNodeCall(function(done) {
      manager.authenticate(credentials.email || '', credentials.password || '', done);
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

    var usersManager = this.api.managers.users;
    var userAuthenticationResults = authenticateUser(usersManager, {
      email: 'test@example.com',
      password: 'password'
    });

    expect(userAuthenticationResults).to.eventually.have.deep.property('email', 'test@example.com');
    expect(userAuthenticationResults).to.not.eventually.have.property('password');
  });
});

describe('Log In', function() {
  beforeEach(function() {
    var usersManager = this.api.managers.users;
    this.page = new LoginPage();

    buildUser(usersManager, {
      email: 'newtestuser@example.com',
      password: 'password'
    });

    this.page.get();
  });

  it('should be possible to log in to an account', function() {
    var emailField = this.page.loginForm.element(by.model('user.email'));
    emailField.sendKeys('newtestuser@example.com');

    var passwordField = this.page.loginForm.element(by.model('user.password'));
    passwordField.sendKeys('password');

    this.page.loginForm.element(by.buttonText('Log In')).click();
    var redirect = browser.getCurrentUrl();
    expect(redirect).to.eventually.equal(helpers.rootUrl + '/#/receipts/thumbnails');

    expect(this.page.flashDiv.getText()).to.eventually.contain('Successfully logged in.');
  });
});
