var _ = require('lodash');
var async = require('async');
var fs = require('fs');

var LAYOUT_TEMPLATE = _.template(fs.readFileSync(__dirname + '/../templates/email-layout.html', 'utf8'));
var PASSWORD_RESET_TEMPLATE = _.template(fs.readFileSync(__dirname + '/../templates/password-reset-content.html', 'utf8'));
var WELCOME_TEMPLATE = _.template(fs.readFileSync(__dirname + '/../templates/welcome-content.html', 'utf8'));

var defaultEmailData = {
  brand: 'Epson',
  productName: 'Reciepts',
  siteUrl: 'some site url',
  supportUrl: 'support@receipts.epson.com'
};

function signupEmail(user, callback) {
  callback(null, _.defaults(
    {
      subject: 'Welcome',
      content: WELCOME_TEMPLATE
    },
    defaultEmailData)
  );
}

function passwordResetEmail(user, callback) {
 callback(null, _.defaults(
    {
      subject: 'Password Reset',
      content: PASSWORD_RESET_TEMPLATE
    },
    defaultEmailData)
  );
}

module.exports = function(MailerService){
  var UserMailer = {};

  UserMailer.mailerService = MailerService;

  UserMailer.sendSignupEmail = function(user, callback) {
    this.sendEmail(signupEmail, user);
    if(callback){
      callback();
    }
  };

  UserMailer.sendPasswordResetEmail = function(user, callback) {
    this.sendEmail(passwordResetEmail, user);
    if(callback){
      callback();
    }
  };

  UserMailer.sendEmail = function(builder, user){
    var self = this;

    async.waterfall([
      function(callback) {
        builder(user, callback);
      },
      function(data, callback) {
        self.buildTemplate(user, data, callback);
      },
      function(email, callback) {
        self.triggerMail(email, callback);
      }
    ], function(err) {
      if (err) { console.warn(err); }
    });
  };

  UserMailer.triggerMail = function(emailContent, callback){
    callback = callback || _.noop;
    if(emailContent){
      this.mailerService.send(emailContent, callback);
    }
  };

  UserMailer.buildTemplate = function(user, data, callback){
    var contentHTML = this.buildContent(user, data);
    var layoutData = _.omit(data, 'content');
    var html = LAYOUT_TEMPLATE({templateData: layoutData, userData: user, content: contentHTML});

    var emailData = _.pick(data, 'from','to','subject');

    _.defaults(emailData, {
      from: this.mailerService.defaultFromEmail, // sender address
      to: user.attributes.email, // list of receivers
      subject: data.subject || '', // Subject line
      generateTextFromHTML: true, // plaintext body
    });

    this.mailerService.inlineCss(html)
    .then(function(inlinedHtml){
      emailData.html = inlinedHtml;
      callback(null, emailData);
    }, callback);
  };

  UserMailer.buildContent = function(user, data){
    var contentTemplate = data.content;
    var contentData = _.omit(data, 'content');
    return contentTemplate({templateData: contentData, userData: user});
  };

  return UserMailer;
};
