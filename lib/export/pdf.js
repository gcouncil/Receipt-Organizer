var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var morph = require('morph');
var PDFDocument = require('pdfkit');

function summarize(items) {
  var summary = {
    count: 0,
    total: 0,
    totalRequested: 0,
    since: undefined,
    until: undefined
  };

  _.each(items, function(item) {
    summary.count++;

    summary.total += item.total || 0;
    summary.totalRequested += item.totalRequested || 0;

    if (_.isEmpty(summary.since) || item.date < summary.since) {
      summary.since = item.date;
    }

    if (_.isEmpty(summary.until) || item.date > summary.until) {
      summary.until = item.date;
    }
  });

  return summary;
}

function sortItems(items) {
  return _.sortBy(items, function(item) {
    return [
      item.date,
      item.receipt || item.id,
      item.type === 'receipt' ? 0 : 1
    ];
  });
}

function makeEntries(items) {
  var entries = [];

  var image = null;

  _.each(items, function(item) {
    if (item.image !== image) {
      image = item.image;
      if (image) {
        entries.push({
          type: 'image',
          image: image
        });
      }
    }

    entries.push({
      type: 'item',
      item: item
    });
  });

  return entries;
}

function formatString(string) {
  return _.isEmpty(string) ? '' : string;
}

function formatAmount(amount) {
  return _.isUndefined(amount) || _.isNull(amount) ? '' : '$' + amount.toFixed(2);
}

function formatDate(date) {
  return _.isEmpty(date) ? '' : moment(date).format('MMM Do YY');
}

function formatYesNo(value) {
  return value ? 'Yes' : 'No';
}

module.exports = function(report, items, options, services, callback) {
  var doc = new PDFDocument({ layout: 'landscape' });

  var ctx = {};

  ctx.items = sortItems(items);
  ctx.summary = summarize(items);

  async.series([
    function(callback) {
      async.reduce(ctx.items, {}, function(memo, item, callback) {
        if (item.image && !memo.hasOwnProperty(item.image)) {
          services.getImage(item.image, function(err, image) {
            memo[item.image] = image;
            callback(err, memo);
          });
        } else {
          callback(null, memo);
        }
      }, function(err, images) {
        ctx.images = images;
        callback(err);
      });
    }
  ], function(err) {
    if (err) { callback(err); }
    else {
      callback(null, doc);
      render();
    }
  });

  function labeledValueLeft(label, value) {
    doc.x = doc.page.margins.left;
    doc.font('Helvetica-Bold').text(label, { continued: true, lineBreak: false });
    doc.font('Helvetica').text(value, { continued: true, lineBreak: false });
  }

  function labeledValueRight(label, value) {
    doc.x = doc.page.width / 2;
    doc.font('Helvetica-Bold').text(label, { continued: true, lineBreak: false });
    doc.font('Helvetica').text(value, { continued: true, lineBreak: false });

    doc.x = doc.page.margins.left;
  }

  function render() {
    doc.fontSize(10);

    var cursor = doc.page.margins.top;

    renderHeader();

    if (options.table) {
      renderTable();
    }

    if (options.items || options.images) {
      renderItems();
    }

    doc.end();
  }

  function renderHeader() {
    doc.fontSize(18);
    doc.font('Helvetica-Bold').text(report.name);

    doc.fontSize(10);

    labeledValueLeft('Items: ', ctx.summary.count);
    labeledValueRight('Total Requested: ', formatAmount(ctx.summary.totalRequested));

    doc.moveDown(1);

    labeledValueLeft('Dates: ', formatDate(ctx.summary.since) + ' - ' + formatDate(ctx.summary.until));
    labeledValueRight('Total: ', formatAmount(ctx.summary.total));

    doc.moveDown(1);

    if (!_.isEmpty(report.comments)) {
      doc.font('Helvetica-Bold').text('Notes');
      doc.font('Helvetica').text(report.comments);
    }

    doc.moveDown(1);
  }

  function renderTable() {
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

      cell(values.number, 27);
      cell(values.vendor, 108);
      cell(values.totalRequested, 90);
      cell(values.total, 90);
      cell(values.date, 72);
      cell(values.description, 108);
      cell(values.location, 72);
      cell(values.payment, 108);

      doc.y = cursor - padding + height;
      doc.x = doc.page.margins.left;
    }

    // Table Header
    tableRow({ number: '#', vendor: 'Vendor', totalRequested: 'Total Requested', total: 'Total', date: 'Date', description: 'Description', location: 'Location', payment: 'Payment' }, 'Helvetica-Bold', 'white', 'black', 'black');

    // Table Rows
    _.each(ctx.items, function(item, i) {
      tableRow({
        number: i + 1 + '',
        vendor: formatString(item.vendor),
        totalRequested: formatAmount(item.totalRequested),
        total: formatAmount(item.total),
        date: formatDate(item.date),
        description: formatString(item.description),
        location: formatString(_.reject([item.city, item.state], _.isEmpty).join(', ')),
        payment: formatString(item.paymentType) },
        'Helvetica', 'black', i % 2 ? '#eee' : 'white', '#ccc');
    });
  }

  function renderItems() {

    // Itemizations w/ images
    var colPadding = 18;
    var colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right - colPadding * 3) / 4;
    var colHeight = (doc.page.height - doc.page.margins.top - doc.page.margins.bottom);

    var col, x, y;

    col = 0;

    var entries = makeEntries(ctx.items);

    entries = _.filter(entries, function(entry) {
      return (entry.type === 'image' && options.images) ||
        (entry.type === 'item' && options.items);
    });

    _.each(entries, function(entry) {
      var firstColumn = col % 4 === 0;
      var lastColumn = col % 4 === 3;
      var keepDataWithImage = lastColumn && options.items && entry.type === 'image';
      if (firstColumn || keepDataWithImage) {
        doc.addPage();
        x = doc.page.margins.left;
        y = doc.page.margins.top;
        col = 0;
      }

      if (entry.type === 'image') {
        doc.image(ctx.images[entry.image], x, y, { fit: [colWidth, colHeight] });
      }

      if (entry.type === 'item') {
        _.each([
          { label: 'Name', value: formatString(entry.item.name) },
          { label: 'Total Requested', value: formatAmount(entry.item.totalRequested) },
          { label: 'Vendor', value: formatString(entry.item.vendor) },
          { label: 'Total', value: formatAmount(entry.item.total) },
          { label: 'Date', value: formatDate(entry.item.date) },
          { label: 'Type', value: morph.toTitle(formatString(entry.item.type)) },
          { label: 'Payment', value: formatString(entry.item.paymentType) },
          { label: 'City', value: formatString(entry.item.city) },
          { label: 'State', value: formatString(entry.item.state) },
          { label: 'Tax', value: formatAmount(entry.item.tax) },
          { label: 'Tax 2', value: formatAmount(entry.item.additionalTax) },
          { label: 'Tip', value: formatAmount(entry.item.tip) },
          { label: 'Category', value: formatString(entry.item.category) },
          { label: 'Billable', value: formatYesNo(entry.item.billable) },
          { label: 'Reimbursable', value: formatYesNo(entry.item.reimbursable) },
        ], function(line) {
          doc.font('Helvetica-Bold').text(line.label, x, y, { width: colWidth });
          var labelWidth = doc.widthOfString(line.label);

          doc.font('Helvetica').text(line.value, x + labelWidth, y, { height: doc.currentLineHeight(), width: colWidth - labelWidth, align: 'right', ellipsis: true });
          y += doc.currentLineHeight(true) * 1.6;

        });

        doc.font('Helvetica-Bold').text('Notes', x, y);
        y += doc.currentLineHeight(true) * 1.6;

        doc.font('Helvetica').text(formatString(entry.item.comments), x, y, { width: colWidth, height: colHeight - y + doc.page.margins.top, ellipsis: true });
      }

      col++;
      x += colWidth + colPadding;
      y = doc.page.margins.top;
    });
  }
};
