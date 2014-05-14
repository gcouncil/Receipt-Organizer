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

  this.receiptEditor = $('.modal-dialog');
  this.receiptEditorForm = $('.modal-dialog form');
  this.receiptEditorSave = this.receiptEditor.element(by.buttonText('Done'));
  this.receiptEditorNext = this.receiptEditor.element(by.buttonText('Next'));
  this.receiptEditorFooter = this.receiptEditor.$('.modal-footer');
  this.receiptEditorNeedsReview = this.receiptEditorFooter.$('input[type="checkbox"]');


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

  this.folderOrganizer = $('.folder-organizer');
  this.firstFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(0));
  this.secondFolderInOrganizer = this.folderOrganizer.element(by.repeater('folder in folders').row(1));
  this.newFolder = $('.new-folder');

  this.reviewFolder = $('.review-folder');
}

module.exports = ItemPage;
