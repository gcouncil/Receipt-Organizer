var http = require('http');
var url = require('url');
var et = require('elementtree');
var moment = require('moment');
var _ = require('lodash');

var template = _.template([
  '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://Parascript.com/FormXtraWeb/2014/06" xmlns:par="http://schemas.datacontract.org/2004/07/Parascript.FormXtra.WebService">',
  '<soapenv:Header/>',
  '<soapenv:Body>',
  '<ns:Recognize>',
  '<ns:requests>',
  '<par:Requests>',
  '<par:Request>',
  '<par:Image><%= image %></par:Image>',
  '<par:PerformRegistration>true</par:PerformRegistration>',
  '</par:Request>',
  '</par:Requests>',
  '</ns:requests>',
  '</ns:Recognize>',
  '</soapenv:Body>',
  '</soapenv:Envelope>'
].join(''));

var mapping = {
  'DATE': 'date',
  'VENDOR': 'vendor',
  'TOTAL': 'total',
  'TAX': 'tax',
  'TIP': 'tip',
  'PAYMENT_TYPE': 'paymentType',
  'CITY': 'city',
  'STATE': 'state'
};

function convert(type, value) {
  if (type === 'Amount') {
    return value ? Number(value) / 100 : null;
  }

  if (type === 'Date') {
    var date =  moment(value, ['MM/DD/YYYY']);
    return date.isValid() ? date.toISOString() : null;
  }

  return value;
}

module.exports = function(config) {
  return function(image, options, callback) {
    var req = http.request(_.extend(url.parse(config.endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://Parascript.com/FormXtraWeb/2014/06/IFormXtraWebService/Recognize'
      }
    }), function(res) {
      var chunks = [];

      res.setEncoding('utf8');

      res.on('data', function(chunk) {
        chunks.push(chunk);
      });

      res.on('end', function() {
        // TODO(hsk): Properly handle XML namespaces since the prefixes
        // (`b:` `c:` etc) are not guaranteed to be fixed
        var doc = et.parse(chunks.join(''));
        var answers =_.map(doc.findall('.//b:FieldAnswer'), function(answer) {
          var recognition = answer.find('.//b:RecognitionAnswer');
          var position = answer.find('.//b:Position');

          var name = answer.findtext('./b:Name');
          if (!_.has(mapping, name)) {
            console.warn('Unkonwn formxtra field ' + name);
          }

          name = mapping[name];
          var type = answer.findtext('./b:FieldType');
          var value = convert(type, recognition.findtext('./c:Text'));

          if (!name || _.isNull(value) || _.isUndefined(value) || value === '') {
            return;
          }

          console.log(name, value);

          return {
            name: name,
            value: value,
            confidence: Number(recognition.findtext('./c:Confidence')) / 100,
            position: {
              w: Number(position.findtext('./c:Width')),
              h: Number(position.findtext('./c:Height')),
              x: Number(position.findtext('./c:X')),
              y: Number(position.findtext('./c:Y'))
            }
          };
        });

        answers = _.select(answers);
        callback(null, answers);
      });
    });

    req.on('error', callback);

    req.write(template({ image: image }));
    req.end();
  };
};
