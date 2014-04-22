var helpers = require('../test-helper');

function ReceiptPage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function(view) {
    browser.get(helpers.rootUrl + '#/receipts' + (view ? '/' + view : ''));
    helpers.loginUser(this.user);
  };

  this.receiptEditor = $('.modal-dialog');
  this.receiptEditorForm = $('.modal-dialog form');
  this.receiptEditorSave = this.receiptEditor.element(by.buttonText('Done'));

  var receiptRepeater = by.repeater('receipt in receipts track by receipt.id');
  this.receipts = element.all(receiptRepeater);
  this.firstReceipt = element(receiptRepeater.row(0));
  this.secondReceipt = element(receiptRepeater.row(1));

  this.receiptDeleteConfirmation = $('.modal-dialog');
  this.receiptDeleteConfirmButton = this.receiptDeleteConfirmation.element(by.buttonText('Delete'));

  this.showThumbnailsButton = $('receipt-view-toggle [title="Thumbnails"]');
  this.showTableButton = $('receipt-view-toggle [title="Table"]');

  this.receiptToolbarEdit = $('receipts-toolbar [title="Edit"]');
  this.receiptToolbarTag = $('receipt-toolbar [titile="Tag"]');
  this.receiptToolbarTagDropdown = $('receipt-dropdown');

  this.tagOrganizer = $('.tag-organizer');
  this.firstTagInOrganizer = this.tagOrganizer.element(by.repeater('tag in tags').row(0));
  this.secondTagInOrganizer = this.tagOrganizer.element(by.repeater('tag in tags').row(1));
  this.newTag = $('.new-tag');
}

module.exports = ReceiptPage;
