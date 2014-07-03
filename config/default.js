var env = process.env.NODE_ENV || 'development';

module.exports = {
  aws: {
    region: 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    namespace: (process.env.AWS_NAMESPACE || process.env.USER) + '-'
  },
  nodeMailer: {
    transport: null,
    defaultFromEmail: ''
  },
  database: {
    database: 'epson_receipts_' + env
  },
  formxtra: {
    endpoint: 'http://54.186.139.13/FormXtraWeb/Service/'
  },
  storage: {
    receiptBucket: 'epsonreceipts-images'
  }
};
