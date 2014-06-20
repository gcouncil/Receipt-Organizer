var fs = require('fs');
var table = fs.readFileSync('txf.txt', 'utf8').split('\n');
var categories = [];
var forms = [];

var group;
table.forEach(function(line) {
  var values = {
    type: parseInt(line.slice(0, 1), 10),
    rnum: parseInt(line.slice(2,5), 10),
    name: line.slice(7, 38).replace(/(^")|("\s+$)/g, ''),
    cpy: line.slice(38, 39),
    srt: line.slice(42, 43),
    sgn: line.slice(46, 47),
    frm: parseInt(line.slice(50, 51), 10),
    line: line.slice(63)
  };

  if (values.type === 0) {
    if (values.rnum > 0) {
      group = values;
      
      forms.push({
        rnum: values.rnum,
        name: values.name
      });
    }

    return;
  }

  categories.push({
    rnum: values.rnum,
    name: values.name,
    form: group.rnum
  });

  forms.push(group.name);
});


fs.writeFileSync('txf.json', JSON.stringify({ categories: categories, forms: forms}));