module.exports = {
  aws: {
    namespace: 'production-'
  },
  nodeMailer: {
    transport: 'SES',
    defaultFromEmail: ''
  },
  database: {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: 'ebdb'
  }
};
