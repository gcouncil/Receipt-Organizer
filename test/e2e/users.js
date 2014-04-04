var helpers = require('./test-helper');
var expect = helpers.expect;

function SignupPage() {
  this.get = function() {
    var url = helpers.rootUrl + '#/signup';
    browser.get(url);
  };

  this.signupForm = $('form');
  this.flashDiv = $('.alert');
}

function LoginPage() {
  this.get = function() {
    var url = helpers.rootUrl + '#/login';
    browser.get(url);
  };

  this.loginForm = $('form');
  this.flashDiv = $('.alert');
}

function ReceiptPage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function() {
    browser.get(helpers.rootUrl);
    helpers.loginUser(this.user);
  };

  this.logoutButton = element(by.buttonText('Log Out'));
  this.flashDiv = $('.alert');
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
    expect(redirect).to.eventually.equal(helpers.rootUrl + '#/receipts/thumbnails');

    expect(this.page.flashDiv.getText()).to.eventually.contain('Successfully signed up!');

    var userAuthenticationResults = this.factory.users.authenticate('test@example.com', 'password');

    expect(userAuthenticationResults).to.eventually.have.deep.property('email', 'test@example.com');
    expect(userAuthenticationResults).to.not.eventually.have.property('password');
  });
});

describe('Log In', function() {
  beforeEach(function() {
    this.page = new LoginPage();

    this.factory.users.create({
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
    expect(redirect).to.eventually.equal(helpers.rootUrl + '#/receipts/thumbnails');

    expect(this.page.flashDiv.getText()).to.eventually.contain('Successfully logged in.');
  });
});

describe('Log Out', function() {
  beforeEach(function() {
    this.page = new ReceiptPage(this.factory);
    this.page.get();
  });

  it('should be possible to log out of an account', function() {
    this.page.logoutButton.click();

    expect(browser.getCurrentUrl()).to.eventually.contain(helpers.rootUrl + '#/login');
    expect(this.page.flashDiv.getText()).to.eventually.contain('Successfully logged out.');
  });
});

