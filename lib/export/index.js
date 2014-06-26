module.exports = {
  pdf: {
    exporter: require('epson-receipts/export/pdf'),
    mimeType: 'application/pdf',
    fileExtention: 'pdf'
  },
  csv: {
    exporter: require('epson-receipts/export/csv'),
    mimeType: 'text/csv',
    fileExtention: 'csv'
  },
  xlsx: {
    exporter: function(){},
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileExtention: 'xlsx'
  },
  qif: {
    exporter: function(){},
    mimeType: 'application/octet-stream',
    fileExtention: 'qif'
  },
  txf: {
    exporter: function(){},
    mimeType: 'tapplication/octet-stream',
    fileExtention: 'txf'
  }
};