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

  this.receiptEditorSave = this.receiptEditor.element(by.partialButtonText('Save Changes'));
  this.receiptEditorRevert = this.receiptEditor.element(by.partialButtonText('Discard Changes'));
  this.receiptEditorNext = this.receiptEditor.element(by.buttonText('Next'));
  this.receiptEditorDone = this.receiptEditor.element(by.buttonText('Done'));
  this.receiptEditorClose = this.receiptEditor.$('[title="Close"]');
  this.receiptEditorFooter = this.receiptEditor.$('.modal-footer');

  this.reportEditor = $('.report-editor-dialog');
  this.reportEditorSave = this.reportEditor.element(by.buttonText('Save Changes'));

  var itemRepeater = by.repeater('item in items track by item.id');
  this.items = element.all(itemRepeater);
  this.firstItem = element(itemRepeater.row(0));
  this.secondItem = element(itemRepeater.row(1));
  this.thirdItem = element(itemRepeater.row(2));
  this.fourthItem = element(itemRepeater.row(3));

  this.firstItemSelect = this.firstItem.$('input[type="checkbox"][selection]');
  this.secondItemSelect = this.secondItem.$('input[type="checkbox"][selection]');

  this.itemDeleteConfirmation = $('.modal-dialog');
  this.itemDeleteConfirmButton = this.itemDeleteConfirmation.element(by.buttonText('Delete'));
  this.itemDeleteCancelButton = this.itemDeleteConfirmation.element(by.buttonText('Cancel'));

  this.itemToolbarEdit = $('items-toolbar').$('[title="Edit"]');
  this.itemToolbarDelete = $('items-toolbar').$('[title="Delete"]');
  this.itemToolbarFolder = $('items-toolbar').$('[title="Folder"]');
  this.itemToolbarCreateReport = $('items-toolbar').$('[title="Create"]');
  this.itemToolbarUpdateReport = $('items-toolbar').$('[title="Update"]');

  this.itemToolbarFolderDropdown = $('.dropdown-menu');
  this.itemToolbarCategory = $('items-toolbar [title="Category"]');
  this.filterToolbarButton = $('items-toolbar').element(by.linkText('Show Filters'));
  this.categoryFilterInput = $('category-filter');
  this.dateFilterInput = $('date-filter');
  this.filterReset = $('filter-reset button');
  this.itemToolbarReset = $('items-toolbar filter-reset button');
  this.filtersNav = $('.navbar-filters');

  this.vendorItemHeader = $('.items-list-view-headers').element(by.linkText('Vendor'));
  this.totalItemHeader = $('.items-list-view-headers').element(by.linkText('Total'));
  this.categoryItemHeader = $('.items-list-view-headers').element(by.linkText('Category'));
  this.foldersItemHeader = $('.items-list-view-headers').element(by.linkText('Folders'));
  this.dateItemHeader = $('.items-list-view-headers').element(by.linkText('Date'));
  this.typeItemHeader = $('.items-list-view-headers').element(by.linkText('Item Type'));

  this.itemToolbarThumbnails = $('items-toolbar [title="Thumbnails"]');
  this.itemToolbarList = $('items-toolbar [title="List"]');

  this.folderOrganizer = $('folder-organizer');
  this.folderOrganizerInbox = $('folder-organizer li.primary');
  this.folderActionsDropdown = $('.dropdown-menu');
  this.firstFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(0));
  this.firstFolderInOrganizerLink = this.firstFolderInOrganizer.$('i.fa-folder');
  this.firstFolderActionsLink = this.firstFolderInOrganizer.$('.caret');
  this.secondFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(1));
  this.secondFolderInOrganizerLink = this.secondFolderInOrganizer.$('i.fa-folder');
  this.newFolder = $('new-folder');
  this.newFolderLink = $('new-folder a');
  this.newFolderSaveButton = $('new-folder button');

  this.reportOrganizer = $('report-organizer');
  this.firstReportInOrganizer = this.reportOrganizer.element(by.repeater('report in reports').row(0));
  this.firstReportActionsLink = this.firstReportInOrganizer.$('.caret');
  this.reportActionsDropdown = $('.dropdown-menu');

  this.reviewFolder = $('review-folder-tab');

  this.notify = $('notices');
}

module.exports = ItemPage;
