var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;

var ExpensePage = require('./pages/expenses-page');

describe('Toggling the View', function() {
  beforeEach(function() {
    this.page = new ExpensePage(this.factory);
    browser.call(function(user) {
      return this.factory.expenses.create({}, { user: user.id });
    }, this, this.page.user);

    this.page.get('table');
  });

  it('should should toggle from the table to the thumbnail view and back', function() {
    expect(this.page.expenses.count()).to.eventually.equal(1);

    // Ensure that table view is displayed
    this.page.showTableButton.click();
    expect($('.expense-thumbnail-fields').isPresent()).to.eventually.be.false;
    expect($('expense-table').isPresent()).to.eventually.be.true;

    // Switch to thumbnail view
    this.page.showThumbnailsButton.click();
    expect($('.expense-thumbnail-fields').isPresent()).to.eventually.be.true;
    expect($('expense-table').isPresent()).to.eventually.be.false;

    // Make sure we can return to table view
    this.page.showTableButton.click();
    expect($('.expense-thumbnail-fields').isPresent()).to.eventually.be.false;
    expect($('expense-table').isPresent()).to.eventually.be.true;
  });
});

//TODO Unable to test e2e due to image creation testing touching AWS
//TODO UNCLE

//describe.only('Image Viewing', function() {
  //beforeEach(function() {
    //var self = this;

    //this.page = new ExpensePage(this.factory);

    //this.page.user.then(function(user) {
      //self.factory.expenses.create({
        //vendor: 'Quick Left',
        //total: 100.00
      //}, { user: user.id });

      //self.factory.images.create({}, { user: user.id}, function(image) {

        //self.factory.expenses.create({
          //vendor: 'Quick Right',
          //total: 100.01,
          //image: image.id
        //}, { user: user.id });

      //});
    //});

    //this.page.get('table');
  //});

  //it('should not show an image', function() {
    //var imageSvg = $('svg');
    //expect(imageSvg.find('image').getAttribute('href')).to.eventually.be.null;
  //});
//});


describe('Pagination', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ExpensePage(this.factory);

    this.page.user.then(function(user) {
      _.times(15, function(i) {
        self.factory.expenses.create({
          vendor: 'Quick Left',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('table');
  });

  it('should contain existing expenses', function() {
    expect($('expense-table').isPresent()).to.eventually.be.true;
    expect($('expense-table').getText()).to.eventually.contain('114.00');
    expect($('expense-table').getText()).to.eventually.contain('106.00');
  });

  it('should display paginated results', function() {
    expect(this.page.expenses.count()).to.eventually.equal(9);
    $('er-pagination .btn-group').element(by.buttonText('Next')).click();
    expect(this.page.expenses.count()).to.eventually.equal(6);
  });
});

describe('Editing Expenses in Table View', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ExpensePage(this.factory);

    this.page.user.then(function(user) {
      self.factory.expenses.create({
        vendor: 'Walmart',
        city: 'Boulder',
        total: 10.00
      }, {
        user: user.id
      });
    });

    this.page.get('table');
  });

  it('should edit a expense with valid values', function() {
    var self = this;

    expect(this.page.expenses.count()).to.eventually.equal(1);
    expect(this.page.firstExpense.evaluate('expense.vendor')).to.eventually.equal('Walmart');

    this.page.firstExpense.$('input[type="checkbox"][selection]').click();
    this.page.expenseToolbarEdit.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('expense.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');
    this.page.receiptEditorSave.click();

    expect(this.page.firstExpense.evaluate('expense.vendor')).to.eventually.equal('Whole Foods');
    expect(this.page.expenses.count()).to.eventually.equal(1);

    // check database for the actual change
    var expenseQueryResults = browser.call(function(user) {
      return self.factory.expenses.query({ user: user.id });
    }, null, this.page.user);

    expect(expenseQueryResults).to.eventually.have.length(1);
    expect(expenseQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });

});

describe('Batch delete', function() {

  beforeEach(function() {
    var self = this;

    this.page = new ExpensePage(this.factory);

    this.page.user.then(function(user) {
      _.times(4, function(i) {
        self.factory.expenses.create({
          vendor: 'Fake Expense Generator',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('table');
  });

  it('should not show delete button without expenses selected', function() {
    var deleteButton = $('expenses-toolbar [title="Delete"]');

    expect(deleteButton.isEnabled()).to.eventually.be.false;

    //delete button is no longer disabled when expenses selected
    this.page.firstExpense.$('[type=checkbox]').click();
    this.page.secondExpense.$('[type=checkbox]').click();

    expect(deleteButton.isEnabled()).to.eventually.be.true;

    //unselecting only one expense will not disable button
    this.page.firstExpense.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;

    //unselecting both expenses will disable button
    this.page.secondExpense.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.false;

    //selecting again will enable button
    this.page.firstExpense.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;
  });

  it('should batch delete existing expenses from the table view', function() {
    var self = this;

    var deleteButton = $('expenses-toolbar [title="Delete"]');
    var firstIdPromise = this.page.firstExpense.evaluate('expense.id');

    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');
    expect(this.page.expenses.count()).to.eventually.equal(4);
    this.page.firstExpense.$('[type=checkbox]').click();
    this.page.secondExpense.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;

    deleteButton.click();
    expect(this.page.expenseDeleteConfirmation.isDisplayed()).to.eventually.be.true;
    $('.modal-dialog').element(by.buttonText('Cancel')).click();
    expect(this.page.expenses.count()).to.eventually.equal(4);

    deleteButton.click();
    this.page.expenseDeleteConfirmButton.click();

    expect(this.page.expenses.count()).to.eventually.equal(2);
    expect(deleteButton.isEnabled()).to.eventually.be.false;

    // confirms that first expense is no longer present
    browser.driver.call(function(firstId) {
      self.page.expenses.each(function(expense) {
        expect(expense.evaluate('expense.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
  });

});

