var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var config = require('config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('index', {
    q: req.query.food + "+新宿",
    f: req.query.food
  });
});

app.post('/', function(req, res) {
  res.render('index', {
    q: req.body.q
  });
});

app.get('/login', function(req, res) {
  res.render('login', {});
});

//var con = "tcp://wnxrnzlqzwkdlx:RYDyaDhiWRAV79Sm9ZUzf-XBv-@ec2-50-16-229-89.compute-1.amazonaws.com:5432/dfsi19sk5qdl26";
//var con = "tcp://wnxrnzlqzwkdlx:RYDyaDhiWRAV79Sm9ZUzf-XBv-@localhost:5432/dfsi19sk5qdl26";
var dbConfig = config.get("dbConfig");
var con = "tcp://" + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.host + ":" + dbConfig.port + "/" + dbConfig.db;

app.post('/login', function(req, res) {
  var loginCd = req.body.loginCd;
  var password = req.body.password;
  pg.connect(con, function(err, client) {
    if (err) {
      console.log(err);
    }
    var query = client.query("select * from users where login_cd='" + loginCd + "' and password='" + password + "';");
    var rows = [];
    query.on('row', function(row) {
      rows.push(row);
    });
    query.on('end', function(row, err) {
      if (rows.length === 0) {
        res.render('index', {
          msgWarn: "ログインIDまたはパスワードが間違っています。"
        });
        return;
      }
      res.render('index', {
        msgSuccess: "ログインしました。",
        userName: rows[0].name
      });
    });
    query.on('error', function(error) {
      console.log("予期せぬエラーが発生しました。" + error);
      res.render('index', {
        data: null,
        msgDanger: "ERROR is occured!"
      });
    });
  });
});

app.post('/regist', function(req, res) {
  var shopName = req.body.shopName;
  var shopNameKana = req.body.shopNameKana;
  var lat = req.body.lat;
  var lng = req.body.lng;
  pg.connect(con, function(err, client) {
    if (err) {
      console.log(err);
    }
    var qstr = "insert into shops (name,name_kana,lat,lng) values($1,$2,$3,$4);";
    var query = client.query(qstr,[shopName, shopNameKana, lat, lng]);
    query.on('end', function(row, err) {
      res.redirect('/');
    });
    query.on('error', function(error) {
      console.log("予期せぬエラーが発生しました。" + error);
      res.render('index', {
        data: null,
        msgDanger: "ERROR is occured!"
      });
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
