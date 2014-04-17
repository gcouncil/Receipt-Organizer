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

  this.receiptEditorForm = $('.modal-dialog form');

  var receiptRepeater = by.repeater('receipt in receipts.pagination.pageItems');
  this.receipts = element.all(receiptRepeater);
  this.firstReceipt = element(receiptRepeater.row(0));
  this.secondReceipt = element(receiptRepeater.row(1));

  this.receiptDeleteForm = $('.modal-dialog form');

  this.showThumbnailsButton = $('receipt-view-toggle [title="Thumbnails"]');
  this.showTableButton = $('receipt-view-toggle [title="Table"]');
}

module.exports = ReceiptPage;
