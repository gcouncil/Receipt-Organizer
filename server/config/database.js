var path = require('path');

module.exports = {
  directory: path.resolve(__dirname, '../migrations'),
  database: {
    client: 'pg',
    connection: {
      database: 'epson_receipts_' + (process.env.NODE_ENV || 'development')
    }
  }
};
