var nodeMailer = require('nodemailer');
var Styliner = require('Styliner');

var Mailer = function(services){
  var ses = new services.aws.SES();

  switch (services.config.nodeMailer.transport) {
    case 'SES':
      this.transport = nodeMailer.createTransport('SES', {
        AWSAccessKeyID: services.aws.config.credentials.accessKeyId,
        AWSSecretKey: services.aws.config.credentials.secretAccessKey,
        ServiceUrl: ses.endpoint.href
      });
      break;
    case 'Direct':
      this.transport = nodeMailer.createTransport('Direct');
      break;
  }

  this.defaultFromEmail = services.config.nodeMailer.defaultFromEmail;
};

Mailer.prototype.send = function(email, callback) {
  if (!this.transport) { return callback(); }

  this.transport.sendMail(email, function(err, response) {
    if (err) { return callback(err); }
    callback(null, response);
    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
  });
};

Mailer.prototype.inlineCss =  function(html){
  var styliner = new Styliner(__dirname, {keepInvalid: true});
  return styliner.processHTML(html);
};

module.exports = Mailer;
