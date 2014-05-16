var util = require('util');
var Model = require('./model');

function Event(attributes) {
  Model.apply(this, arguments);
}

util.inherits(Event, Model);

Model.addAttributes(Event, {
  id: undefined,
  name: undefined,
  data:undefined
});

module.exports = Event;
