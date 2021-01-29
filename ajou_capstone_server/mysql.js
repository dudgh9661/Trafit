var express=require('express');
var fs=require('fs');
var app=express();
var mysql= require('mysql');
var tunnel = require('tunnel-ssh');

var connection = mysql.createConnection({
  host : '27.96.131.37',
  user     : 'hong',
  password : 'ckwjdgus',
  database : 'trap'

});

connection.connect(function(err){
  if(err){
  console.log("fail");
    console.error('error connecting'+err.stack);
    return;
  }
  else{
        console.log("suc");
  }
})

app.get('/user',(req, res)=>{
        connection.query('SELECT * from user', function(err, rows, fields) {
          if (!err)
            {console.log('The solution is: ', rows);
                var result = 'rows : ' + JSON.stringify(rows);
            res.send(result);
                }
          else{
            console.log('Error while performing Query.', err);
          }
        });
});

app.get('/chatroom',(req, res)=>{
connection.query('SELECT * from chatroom', function(err, rows, fields) {
  if (!err)
    {console.log('The solution is: ', rows);
        var result = 'rows : ' + JSON.stringify(rows);
    res.send(result);
        }
  else
    console.log('Error while performing Query.', err);
});
});

app.get('/imgs', function(req, res){

  connection.query('SELECT * from user where ', function(err, rows, fields) {
  if (!err)
    {
    fs.readFile('/imgs/' + req.imgs,function(error,data){
        res.writeHead(200, {'Content-Type : text/html'});
        res.end(data);
    });
        }
  else
    console.log('Error while performing Query.', err);
});
});


app.listen(9000, function() {
  console.log('Server running at port 9000');
});
