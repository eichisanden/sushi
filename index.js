var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('index', {q: req.query.food + "+新宿", f: req.query.food});
});

app.post('/', function(req, res) {
  console.log(req.param("q"));
  console.log(req.body.q);
  console.log(req.query.hoge);
  res.render('index', {q: req.body.q});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
