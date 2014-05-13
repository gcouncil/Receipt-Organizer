var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;
var ExpensePage = require('./pages/expenses-page');

describe('Manual Entry', function() {
  beforeEach(function() {
    this.page = new ExpensePage(this.factory);
    this.page.get();
    $('.caret').click();
    element(by.linkText('Manual Entry')).click();
  });

  it('should show form when manual entry link is clicked', function() {
    expect(this.page.receiptEditorForm.isDisplayed()).to.eventually.be.true;
  });

  it('should create a new expenses when the expense is saved with valid data', function() {
    var totalEl = this.page.receiptEditorForm.element(by.model('expense.total'));
    totalEl.clear();
    totalEl.sendKeys('39.99');

    var categoryEl = this.page.receiptEditorForm.element(by.model('expense.category'));
    categoryEl.clear();
    categoryEl.sendKeys('Miscellaneous');

    expect(this.page.expenses.count()).to.eventually.equal(0);
    this.page.receiptEditorSave.click();
    expect(this.page.expenses.count()).to.eventually.equal(1);
    expect(this.page.firstExpense.element(by.binding('expense.total')).getText()).to.eventually.equal('$39.99');
  });
});

describe('Editing Expenses', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ExpensePage(this.factory);

    this.page.user.then(function(user) {
      self.factory.items.create({
        vendor: 'Walmart',
        city: 'Boulder',
        total: 10.00
      }, {
        user: user.id
      });
    });

    this.page.get();
  });

  it('should edit a expense with valid values', function() {
    var self = this;

    expect(this.page.expenses.count()).to.eventually.equal(1);

    this.page.firstExpense.evaluate('expense');
    expect(this.page.firstExpense.evaluate('expense.vendor')).to.eventually.equal('Walmart');

    this.page.firstExpense.$('.fa-edit').click();
    var originalVendor = this.page.receiptEditorForm.element(by.model('expense.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');
    this.page.receiptEditorSave.click();

    expect(this.page.firstExpense.evaluate('expense.vendor')).to.eventually.equal('Whole Foods');
    expect(this.page.expenses.count()).to.eventually.equal(1);

    // check database for the actual change
    var expenseQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(expenseQueryResults).to.eventually.have.length(1);
    expect(expenseQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });
});

describe('Deleting Expenses', function() {
  beforeEach(function() {
    var self = this;
    this.page = new ExpensePage(this.factory);

    this.page.user.then(function(user) {
      _.each([
        { total: 39.99 },
        { total: 100.99 },
        { total: 2.99 }
      ], function(data) {
        self.factory.items.create(data, {
          user: user.id
        });
      });
    });

    this.page.get();
  });

  it('should remove expenses when delete button is clicked', function() {
    var self = this;
    expect(this.page.expenses.count()).to.eventually.equal(3);
    var firstIdPromise = this.page.firstExpense.evaluate('expense.id');
    this.page.firstExpense.$('.fa-trash-o').click();
    this.page.expenseDeleteConfirmButton.click();
    expect(this.page.expenses.count()).to.eventually.equal(2);
    browser.driver.call(function(firstId) {
      self.page.expenses.each(function(expense) {
        expect(expense.evaluate('expense.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
  });

});

describe('Batch delete', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ExpensePage(this.factory);

    this.page.user.then(function(user) {
      _.times(4, function(i) {
        self.factory.items.create({
          vendor: 'Fake Expense Generator',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('table');
  });

  it('should batch delete existing expenses from the thumbnail view', function() {
    var self = this;
    $('expense-view-toggle [title="Thumbnails"]').click();

    var deleteButton = $('expenses-toolbar [title="Delete"]');
    var firstIdPromise = this.page.firstExpense.evaluate('expense.id');

    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');
    expect(this.page.expenses.count()).to.eventually.equal(4);
    this.page.firstExpense.$('[type=checkbox]').click();
    this.page.secondExpense.$('[type=checkbox]').click();
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal(null);

    deleteButton.click();
    expect(this.page.expenseDeleteConfirmation.isDisplayed()).to.eventually.be.true;
    $('.modal-dialog').element(by.buttonText('Cancel')).click();
    expect(this.page.expenses.count()).to.eventually.equal(4);

    deleteButton.click();
    this.page.expenseDeleteConfirmButton.click();
    expect(this.page.expenses.count()).to.eventually.equal(2);
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');

    // confirms that first expense is no longer present
    browser.driver.call(function(firstId) {
      self.page.expenses.each(function(expense) {
        expect(expense.evaluate('expense.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
  });
});

describe('Review Folder', function() {
  context('with unreviewed expenses', function() {
    beforeEach(function() {
      var self = this;

      this.page = new ExpensePage(this.factory);

      this.page.user.then(function(user) {
        _.times(4, function(i) {
          self.factory.items.create({
            reviewed: false
          }, { user: user.id });
        });
        self.factory.items.create({
          reviewed: true
        }, { user: user.id });
        self.factory.folders.create({
          name: 'EmptyFolder'
        }, { user: user.id });

      });
      this.page.get('table');
    });

    it('should inform the user how many expenses require review', function() {
      expect(this.page.expenses.count()).to.eventually.equal(5);
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed (4)');
    });

    it('should toggle the viewable receipts', function() {
      expect(this.page.expenses.count()).to.eventually.equal(5);
      this.page.reviewFolder.click();
      expect(this.page.expenses.count()).to.eventually.equal(4);
    });

    it('should display correct total when navigating through folders', function() {
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed (4)');
      this.page.firstFolderInOrganizer.click();
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed (4)');
    });

    it('should update unreviewed total on delete', function() {
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed (4)');
      this.page.secondExpenseSelect.click();
      this.page.expenseToolbarDelete.click();
      this.page.expenseDeleteConfirmButton.click();
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed (3)');
    });

    it('should update unreviewed total on setting reviewed receipt to unreviewed', function() {
      this.page.firstExpenseSelect.click();
      this.page.expenseToolbarEdit.click();
      this.page.receiptEditorNeedsReview.click();
      this.page.receiptEditorSave.click();
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed (5)');
    });
  });
});

describe('Scoping to the current user', function() {
  beforeEach(function() {
    var self = this;
    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });
    var otherUser = this.factory.users.create({
      email: 'other@example.com',
      password: 'password'
    });

    this.page = new ExpensePage(this.factory, user);

    user.then(function(user) {
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99 }, { user: user.id });
    });
    otherUser.then(function(otherUser) {
      self.factory.items.create({ vendor: 'Microsoft', total: 200.00 }, { user: otherUser.id });
    });

    this.page.get();
  });

  it('should only show the current users expenses', function() {
    expect(this.page.expenses.count()).to.eventually.equal(1);
    expect(this.page.firstExpense.element(by.binding('expense.total')).getText()).to.eventually.equal('$199.99');
    expect(this.page.firstExpense.element(by.binding('expense.vendor')).getText()).to.eventually.equal('Quick Left');
  });
});

