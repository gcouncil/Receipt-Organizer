module.exports = {
  database: {
    name: 'epson_receipts_' + (process.env.NODE_ENV || 'development')
  }
};
