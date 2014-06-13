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

function ItemPage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function() {
    browser.get(helpers.rootUrl);
    helpers.loginUser(this.user);
  };

  this.logoutButton = element(by.linkText('Log Out'));
  this.flashDiv = $('.alert');
}

function SettingsPage(factory, user) {
  this.user = user ||  factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function(subPage) {
    subPage = subPage || 'categories';
    browser.get(helpers.rootUrl);
    helpers.loginUser(this.user);
    browser.get(helpers.rootUrl + '#/settings/' + subPage);
  };

  this.user.then(function(user) {
    factory.items.create({
      vendor: 'Target',
      city: 'Boulder',
      total: 12.00,
      formxtraStatus: 'skipped'
    }, {
      user: user.id
    });
  });


  this.categoryRepeater = by.repeater('category in categories');
  this.categories = element.all(this.categoryRepeater);
  this.firstCategory = element(this.categoryRepeater.row(0));

  this.formFieldRepeater = by.repeater('field in fields');
  this.fields = element.all(this.formFieldRepeater);
  this.firstField = element(this.formFieldRepeater.row(0));

  this.saveButton = element(by.buttonText('Save Changes'));
  this.cancelButton = element(by.buttonText('Discard Changes'));
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
    expect(redirect).to.eventually.equal(helpers.rootUrl + '#/items');

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
    expect(redirect).to.eventually.equal(helpers.rootUrl + '#/items');

    expect(this.page.flashDiv.getText()).to.eventually.contain('Successfully logged in.');
  });
});

describe('Log Out', function() {
  beforeEach(function() {
    this.page = new ItemPage(this.factory);
    this.page.get();
  });

  it('should be possible to log out of an account', function() {
    this.page.logoutButton.click();

    expect(browser.getCurrentUrl()).to.eventually.contain(helpers.rootUrl + '#/login');
    expect(this.page.flashDiv.getText()).to.eventually.contain('Successfully logged out.');
  });
});

describe('User Settings', function() {

  context('categories', function() {
    beforeEach(function() {
      this.page = new SettingsPage(this.factory);
      this.page.get();
    });

    it('should create', function() {
      element(by.model('newCategory')).sendKeys('New Category 1');
      element(by.buttonText('+')).click();
      expect(element(this.page.categoryRepeater.row(15)).$('input').getAttribute('value')).to.eventually.equal('New Category 1');
    });

    it('should edit', function() {
      expect(this.page.firstCategory.$('input').getAttribute('value')).to.eventually.equal('Airline');
      this.page.firstCategory.$('input').clear();
      this.page.firstCategory.$('input').sendKeys('Bearline');
      this.page.saveButton.click();
      expect(this.page.firstCategory.$('input').getAttribute('value')).to.eventually.equal('Bearline');
      expect(this.page.flashDiv.getText()).to.eventually.equal('Saved your category preferences.');
    });

    it('should not edit on cancel', function() {
      expect(this.page.firstCategory.$('input').getAttribute('value')).to.eventually.equal('Airline');
      this.page.firstCategory.$('input').clear();
      this.page.firstCategory.$('input').sendKeys('Bearline');
      this.page.cancelButton.click();
      expect(this.page.flashDiv.getText()).to.eventually.equal('Your changes were cancelled.');
      element(by.linkText('Settings')).click();
      expect(this.page.firstCategory.$('input').getAttribute('value')).not.to.eventually.equal('Bearline');
    });

    it('should delete', function() {
      expect(this.page.firstCategory.$('input').getAttribute('value')).to.eventually.equal('Airline');
      this.page.firstCategory.$('.fa-trash-o').click();
      expect(this.page.firstCategory.$('input').getAttribute('value')).not.to.eventually.equal('Airline');
      expect(this.page.flashDiv.getText()).to.eventually.equal('Deleted the Airline category.');
      this.page.categories.each(function(category) {
        expect(category.$('input').getAttribute('value')).not.to.eventually.equal('Airline');
      });
    });

    it('should show the categories in the receipt editor', function() {
      expect(this.page.firstCategory.$('input').getAttribute('value')).to.eventually.equal('Airline');
      this.page.firstCategory.$('input').clear();
      this.page.firstCategory.$('input').sendKeys('Bearline');
      this.page.saveButton.click();
      expect(this.page.firstCategory.$('input').getAttribute('value')).to.eventually.equal('Bearline');

      // go to items page
      browser.get(helpers.rootUrl + '/#/items');
      element(by.repeater('item in items track by item.id').row(0)).click();
      expect($('[data-value="Bearline"]').getInnerHtml()).to.eventually.contain('Bearline');
    });
  });

  context('form fields', function() {
    beforeEach(function() {
      this.page = new SettingsPage(this.factory);
      this.page.get('form-fields');
    });

    it('should update a field name', function() {
      var self = this;
      expect(this.page.firstField.element(by.model('field.name')).getAttribute('value')).to.eventually.equal('Custom Field 1');
      this.page.firstField.element(by.model('field.name')).clear();
      this.page.firstField.element(by.model('field.name')).sendKeys('Godzilla');
      $('.fields-settings-save').click();

      expect(this.page.flashDiv.getText()).to.eventually.equal('Saved your form field preferences.');
      browser.driver.call(function() {
        self.page.firstField.evaluate('field.name').then(function(name) {
          expect(name).to.equal('Godzilla');
        });
      });
    });

    it('should update a field\'s visibility', function() {
      var self = this;
      expect(this.page.firstField.element(by.model('field.selected')).isSelected()).to.eventually.be.false;
      this.page.firstField.element(by.model('field.selected')).click();
      $('.fields-settings-save').click();

      expect(this.page.flashDiv.getText()).to.eventually.equal('Saved your form field preferences.');
      browser.driver.call(function() {
        self.page.firstField.evaluate('field.selected').then(function(name) {
          expect(name).to.be.true;
        });
      });
    });

    it('should show the form fields in the receipt editor', function() {
      expect(this.page.firstField.element(by.model('field.selected')).isSelected()).to.eventually.be.false;
      this.page.firstField.element(by.model('field.selected')).click();
      $('.fields-settings-save').click();

      // go to items page
      browser.get(helpers.rootUrl + '/#/items');
      element(by.repeater('item in items track by item.id').row(0)).click();
      expect(element(by.repeater('field in customFields').row(0)).$('span').getText()).to.eventually.equal('Custom Field 1');
    });
  });
});
