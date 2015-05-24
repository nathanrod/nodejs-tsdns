
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tsdns.sqlite');
var express = require('express');
var app = express();

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS zones (id integer primary key, zone varchar(100),target varchar(39))");
});

app.get('/list', function (req, res) {
  var zone = req.params.zone;
  db.all("SELECT * FROM zones", function(err, rows) {
     res.send('{"result":"success","message":' + JSON.stringify( rows ) + '}');
  });

});

app.get('/add/:zone/:target', function (req, res) {
  var zone = req.params.zone;
  var target = req.params.target;
  var sql = "INSERT INTO zones(zone,target) VALUES(?,?)";
  var stmt = db.prepare(sql,zone,target);
  stmt.run();
  stmt.finalize();
  res.send('{result:"success"}');
});

app.get('/del/:zone', function (req, res) {
  var zone = req.params.zone;
  var sql = "DELETE FROM zones WHERE zone =?";
  var stmt = db.prepare(sql,zone);
  stmt.run();
  stmt.finalize();
  res.send('{result:"success"}');
});

app.get('/get/:zone', function (req, res) {
  var zone = req.params.zone;
  db.all("SELECT * FROM zones WHERE zone=?",zone, function(err, row) {
     res.send('{"result":"success","message":' + JSON.stringify( row ) + '}');
  });

});

module.exports = app;
