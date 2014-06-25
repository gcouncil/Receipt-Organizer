var _ = require('lodash');
var moment = require('moment');
var PDFDocument = require('pdfkit');

module.exports = function(report, items, options, callback) {
  var doc = new PDFDocument({ layout: 'landscape' });

  callback(null, doc);

  doc.fontSize(12);

  var cursor = doc.page.margins.top;

  function labeledValueLeft(label, value) {
    doc.x = doc.page.margins.left;
    doc.font('Helvetica-Bold').text(label, { continued: true, lineBreak: false });
    doc.font('Helvetica').text(value, { continued: true, lineBreak: false });
  }

  function labeledValueRight(label, value) {
    doc.x = doc.page.width / 2;
    doc.font('Helvetica-Bold').text(label, { continued: true, lineBreak: false });
    doc.font('Helvetica').text(value, { continued: true, lineBreak: false });
  }


  labeledValueLeft('Report: ', report.name);
  labeledValueRight('Items: ', report.items.length);

  doc.moveDown(1);

  labeledValueLeft('Dates: ', moment().format('MMMM Do YYYY') + ' - ' + moment().format('MMMM Do YYYY'));
  labeledValueRight('Total: ', '$500.96');

  doc.moveDown(1);

  function tableRow(values, font, foreground, background, stroke) {
    doc.font(font);

    doc.x = doc.page.margins.left;
    var cursor = doc.y;
    var padding = 9;
    var height = doc.currentLineHeight() + (padding * 2);

    // Check if it would overflow this page
    if (cursor + height > (doc.page.height - doc.page.margins.bottom)) {
      doc.addPage();
      cursor = doc.y = doc.page.margins.top;
    }

    doc.rect(doc.page.margins.left, doc.y, doc.page.width - (doc.page.margins.left + doc.page.margins.right), height);
    doc.fillAndStroke(background, stroke);

    cursor += padding;

    doc.fillColor(foreground);
    var left = doc.page.margins.left + 9;

    function cell(text, width) {
      text = _.isEmpty(text) ? '' : text + '';
      doc.text(text, left, cursor, { height: height - padding * 2, width: width, ellipsis: true });
      left += width;
    }

    cell(values.number, 36);
    cell(values.vendor, 108);
    cell(values.amount, 72);
    cell(values.date, 72);
    cell(values.description, 144);
    cell(values.location, 108);
    cell(values.payment, 144);

    doc.y = cursor - padding + height;
    doc.x = doc.page.margins.left;
  }

  // Table Header

  tableRow({ number: '#', vendor: 'Vendor', amount: 'Amount', date: 'Date', description: 'Description', location: 'Location', payment: 'Payment' }, 'Helvetica-Bold', 'white', 'black', 'black');

  // Table Rows
  _.each(items, function(item, i) {
    tableRow({
      number: i + 1,
      vendor: item.vendor,
      amount: item.amount,
      date: item.date ? moment(item.date).format('MMM Do YY') : undefined,
      description: item.description,
      location: _.reject([item.city, item.state], _.isEmpty).join(', '),
      payment: item.paymentType },
    'Helvetica', 'black', i % 2 ? '#eee' : 'white', '#ccc');
  });

  doc.end();
};
