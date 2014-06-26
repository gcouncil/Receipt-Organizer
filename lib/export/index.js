module.exports = {
  pdf: {
    exporter: require('epson-receipts/export/pdf'),
    mimeType: 'application/pdf',
    fileExtension: 'pdf'
  },
  csv: {
    exporter: require('epson-receipts/export/csv'),
    mimeType: 'text/csv',
    fileExtension: 'csv'
  },
  xlsx: {
    exporter: function(){},
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileExtension: 'xlsx'
  },
  qif: {
    exporter: function(){},
    mimeType: 'application/octet-stream',
    fileExtension: 'qif'
  },
  txf: {
    exporter: function(){},
    mimeType: 'tapplication/octet-stream',
    fileExtension: 'txf'
  }
};