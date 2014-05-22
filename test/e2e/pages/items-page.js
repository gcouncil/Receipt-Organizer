var helpers = require('../test-helper');

function ItemPage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function(view) {
    browser.get(helpers.rootUrl + '#/items' + (view ? '/' + view : ''));
    helpers.loginUser(this.user);
  };

  this.receiptEditor = $('.receipt-editor-dialog');
  this.receiptEditorForm = $('.receipt-editor-dialog form');
  this.receiptEditorSave = this.receiptEditor.element(by.buttonText('Done'));
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

  this.showThumbnailsButton = $('item-view-toggle [title="Thumbnails"]');
  this.showTableButton = $('item-view-toggle [title="Table"]');

  this.itemToolbarEdit = $('items-toolbar [title="Edit"]');
  this.itemToolbarDelete = $('items-toolbar [title="Delete"]');
  this.itemToolbarFolder = $('items-toolbar [title="Folder"]');
  this.itemToolbarFolderDropdown = $('.item-dropdown');
  this.itemToolbarCategory = $('items-toolbar [title="Category"]');
  this.categoryFilterInput = $('category-filter-input');
  this.dateFilterInput = $('date-filter-input');
  this.itemToolbarReset = $('items-toolbar .reset-nav li a');
  this.itemToolbarCreateReport = $('items-toolbar [title="Create New Report"]');
  this.itemToolbarUpdateReport = $('items-toolbar [title="Report"]');

  this.folderOrganizer = $('.folder-organizer');
  this.firstFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(0));
  this.secondFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(1));
  this.newFolder = $('.new-folder');

  this.reportOrganizer = $('.report-organizer');
  this.firstReportInOrganizer = this.reportOrganizer.element(by.repeater('report in reports').row(0));

  this.reviewFolder = $('.review-folder');

  this.notify = $('notices');
}

module.exports = ItemPage;
