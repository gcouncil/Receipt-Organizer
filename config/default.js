module.exports = {
  database: {
    database: 'epson_receipts_' + (process.env.NODE_ENV || 'development')
  }
};
