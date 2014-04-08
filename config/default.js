var env = process.env.NODE_ENV || 'development';

module.exports = {
  aws: {
    region: 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  storage: {
    receiptBucket: 'epsonreceipts-' + env + '-images'
  },
  database: {
    database: 'epson_receipts_' + env
  }
};
