module.exports = {
  pdf: {
    exporter: require('./pdf'),
    mimeType: 'application/pdf',
    fileExtension: 'pdf'
  },
  csv: {
    exporter: require('./csv'),
    mimeType: 'text/csv',
    fileExtension: 'csv'
  },
  xlsx: {
    exporter: function(){},
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileExtension: 'xlsx'
  },
  qif: {
    exporter: require('./qif'),
    mimeType: 'text/other',
    fileExtension: 'qif'
  },
  txf: {
    exporter: require('./txf'),
    mimeType: 'text/other',
    fileExtension: 'txf'
  }
};
