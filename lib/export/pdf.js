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

function groupItemsByCategory(items) {
  var groupedItems = _.groupBy(items, function(item) {
    return item.category;
  });
  
  var sortedGroup = _.map(groupedItems, function (group, groupName) {
    return sortItems(group);
  });

  return sortedGroup;
}

function makeEntries(items) {
  var entries = [];

  var receipt = null;
  var imageEntry;

  _.each(items, function(item, i) {
    if ((item.receipt || item.id) !== receipt) {
      receipt = item.receipt || item.id;

      if (item.image) {
        imageEntry = {
          type: 'image',
          image: item.image,
          first: i + 1
        };
        entries.push(imageEntry);
      } else {
        imageEntry = {};
      }
    }

    imageEntry.last = i + 1;
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

function formatAmountParens (amount) {
  return _.isUndefined(amount) || _.isNull(amount) ? '' : '( $ ' + amount.toFixed(2) + ' )';
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
  
  ctx.groupItemsByCategory = options.groupByCategory;

  if(ctx.groupItemsByCategory) {
    ctx.groups = groupItemsByCategory(items);
  } else {
    ctx.groups = [sortItems(items)];
  }

  ctx.items = _.flatten(ctx.groups, false);
  ctx.summary = summarize(items);
  ctx.images = {};

  async.series([
    function(callback) {
      async.eachLimit(ctx.items, 4, function(item, callback) {
        if (item.image && !ctx.images.hasOwnProperty(item.image)) {
          services.getImage(item.image, function(err, image) {
            ctx.images[item.image] = image;
            callback(err);
          });
        } else {
          callback(null);
        }
      }, callback);
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
      cell(values.date, 72);
      cell(values.type, 72);
      cell(values.location, 72);
      cell(values.payment, 80);
      cell(values.category, 100);
      cell(values.total, 110);

      doc.y = cursor - padding + height;
      doc.x = doc.page.margins.left;
    }

    // Table Header
    tableRow({ number: '#', vendor: 'Vendor', total: 'Total + (Requested)', date: 'Date', type: 'Type', location: 'Location', payment: 'Payment', category: 'Category' }, 'Helvetica-Bold', 'white', 'black', 'black');

    // Table Rows
    _.each(ctx.groups, function(items) {
      var summary = { total: 0, totalRequested: 0 };
      _.each(items, function(item, i) {
        summary.total += item.total || 0;
        summary.totalRequest += item.totalRequested || 0;
        tableRow({
          number: i + 1 + '',
          vendor: formatString(item.vendor),
          category: formatString(item.category),
          total: formatAmount(item.total) + formatAmountParens(item.totalRequested),
          date: formatDate(item.date),
          type: morph.toTitle(formatString(item.type)),
          location: formatString(_.reject([item.city, item.state], _.isEmpty).join(', ')),
          payment: formatString(item.paymentType) },
          'Helvetica', 'black', i % 2 ? '#eee' : 'white', '#ccc');
      });

      if(ctx.groupItemsByCategory){
        // Summary Row
        tableRow({
          category: 'Subtotal:',
          total: formatAmount(summary.total) + formatAmountParens(summary.totalRequested),
        }, 'Helvetica', 'white', '#555', '#555');
      }
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
        doc.font('Helvetica-Bold').fontSize(18);
        if (entry.first !== entry.last) {
          doc.text('Items: #' + entry.first + ' - #' + entry.last, x, y, { width: colWidth, lineBreak: false, ellipsis: true });
        } else {
          doc.text('Item: #' + entry.first, x, y, { width: colWidth, lineBreak: false, ellipsis: true });
        }
        doc.image(ctx.images[entry.image], x, y + doc.currentLineHeight(), { fit: [colWidth, colHeight - doc.currentLineHeight()] });
        doc.fontSize(10);
      }

      if (entry.type === 'item') {
        _.each([
          { label: 'Name', value: formatString(entry.item.name) },
          { label: 'Vendor', value: formatString(entry.item.vendor) },
          { label: 'Total', value: formatAmount(entry.item.total) + formatAmountParens(entry.item.totalRequested) },
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
