var helpers = require('../test-helper');

function ItemPage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function(view) {
    browser.get(helpers.rootUrl + '#/items' + (view ? '?view=' + view : ''));
    helpers.loginUser(this.user);
  };

  this.receiptEditor = $('.receipt-editor-dialog');
  this.receiptEditorForm = $('.receipt-editor-dialog form');
  this.receiptEditorSave = this.receiptEditor.element(by.buttonText('Done'));
  this.receiptEditorCancel = this.receiptEditor.element(by.buttonText('Cancel'));
  this.receiptEditorNext = this.receiptEditor.element(by.buttonText('Next'));
  this.receiptEditorFooter = this.receiptEditor.$('.modal-footer');
  this.receiptEditorNeedsReview = this.receiptEditorFooter.$('input[type="checkbox"]');

  this.reportEditor = $('.report-editor-dialog');
  this.reportEditorSave = this.reportEditor.element(by.buttonText('Save & Close'));
  this.reportEditorCancel = this.reportEditor.element(by.buttonText('Cancel'));

  var itemRepeater = by.repeater('item in items track by item.id');
  this.items = element.all(itemRepeater);
  this.firstItem = element(itemRepeater.row(0));
  this.secondItem = element(itemRepeater.row(1));

  this.firstItemSelect = this.firstItem.$('input[type="checkbox"][selection]');
  this.secondItemSelect = this.secondItem.$('input[type="checkbox"][selection]');

  this.itemDeleteConfirmation = $('.modal-dialog');
  this.itemDeleteConfirmButton = this.itemDeleteConfirmation.element(by.buttonText('Delete'));

  this.itemToolbarEdit = $('items-toolbar').element(by.partialButtonText('Edit'));
  this.itemToolbarDelete = $('items-toolbar').element(by.partialButtonText('Delete'));
  this.itemToolbarFolder = $('items-toolbar').element(by.partialButtonText('Add to Folder'));

  this.itemToolbarFolderDropdown = $('.item-dropdown');
  this.itemToolbarCategory = $('items-toolbar [title="Category"]');
  this.filterToolbarButton = $('items-toolbar').element(by.partialButtonText('Filter'));
  this.categoryFilterInput = $('category-filter');
  this.dateFilterInput = $('date-filter');
  this.filterReset = $('filter-reset button');
  this.itemToolbarReset = $('items-toolbar filter-reset button');
  this.filtersNav = $('.navbar-filters');
  this.itemToolbarCreateReport = $('items-toolbar').element(by.partialButtonText('Create Report'));
  this.itemToolbarUpdateReport = $('items-toolbar').element(by.partialButtonText('Add to Report'));

  this.itemToolbarThumbnails = $('items-toolbar [title="Thumbnails"]');
  this.itemToolbarList = $('items-toolbar [title="List"]');

  this.folderOrganizer = $('folder-organizer');
  this.firstFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(0));
  this.folderActionsDropdown = $('.dropdown-menu');
  this.secondFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(1));
  this.newFolder= $('new-folder');
  this.newFolderLink = $('new-folder a');
  this.newFolderSaveButton = $('new-folder button');

  this.reportOrganizer = $('report-organizer');
  this.firstReportInOrganizer = this.reportOrganizer.element(by.repeater('report in reports').row(0));

  this.reviewFolder = $('review-folder-tab');

  this.notify = $('notices');
}

module.exports = ItemPage;
