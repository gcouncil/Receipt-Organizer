var helpers = require('../test-helper');

function ExpensePage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function(view) {
    browser.get(helpers.rootUrl + '#/expenses' + (view ? '/' + view : ''));
    helpers.loginUser(this.user);
  };

  this.receiptEditor = $('.modal-dialog');
  this.receiptEditorForm = $('.modal-dialog form');
  this.receiptEditorSave = this.receiptEditor.element(by.buttonText('Done'));
  this.receiptEditorNext = this.receiptEditor.element(by.buttonText('Next'));

  var expenseRepeater = by.repeater('expense in expenses track by expense.id');
  this.expenses = element.all(expenseRepeater);
  this.firstExpense = element(expenseRepeater.row(0));
  this.secondExpense = element(expenseRepeater.row(1));

  this.expenseDeleteConfirmation = $('.modal-dialog');
  this.expenseDeleteConfirmButton = this.expenseDeleteConfirmation.element(by.buttonText('Delete'));

  this.showThumbnailsButton = $('expense-view-toggle [title="Thumbnails"]');
  this.showTableButton = $('expense-view-toggle [title="Table"]');

  this.expenseToolbarEdit = $('expenses-toolbar [title="Edit"]');
  this.expenseToolbarDelete = $('expenses-toolbar [title="Delete"]');
  this.expenseToolbarFolder = $('expenses-toolbar [title="Folder"]');
  this.expenseToolbarFolderDropdown = $('.expense-dropdown');

  this.folderOrganizer = $('.folder-organizer');
  this.firstFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(0));
  this.secondFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(1));
  this.newFolder = $('.new-folder');

  this.expenseCallout = $('.animate-if');
  this.expenseReviewNowButton = $('.animate-if [title="Review Now"]');
}

module.exports = ExpensePage;
