var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var storage;
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var app = express();

var connection = mysql.createConnection({
  host: "27.96.131.37",
  user: "hong",
  database: "trap",
  password: "ckwjdgus"
});

storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
});

// bodyParser is a type of middlewareg
// It helps convert JSON strings
// the 'use' method assigns a middleware
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({extended: false}));

const hostname = 'localhost';
const port = 3300;

// http status codes
const statusOK = 200;
const statusNotFound = 404;



// Handle POST request
app.post('/test2', function(req, res) {
  roomnumber = req.body['room'];
  res.json({message: success})
});

app.post('/upload',multer({storage: storage}).single('image'),function(req,res){
    var result;
    console.log(req.file.filename);

    res.send({id: 'asdf', password: '1111'});
})

app.post('/login_check', function (req, res) {
  var userid = req.body.id;
  var userPwd = req.body.password;
  var sql = 'select * from user where id = ?';

  connection.query(sql, userid, function (err, result) {
      var resultCode = 404;
      var message = '에러가 발생했습니다';

      if (err) {
          console.log(err);
      } else {
          if (result.length === 0) {
              resultCode = 204;
              message = '존재하지 않는 계정입니다!';
          } else if (userPwd !== result[0].password) {
              resultCode = 204;
              message = '비밀번호가 틀렸습니다!';
          } else {
              resultCode = 200;
              message = '로그인 성공! ' + result[0].username + '님 환영합니다!';
          }
      }
      if(resultCode==200){
        res.json({
          'code': resultCode,
          'message': message,
          'username': result[0].username,
          'introduce': result[0].introduce,
          'age': result[0].age,
          'gender': result[0].gender,
          'room_num': result[0].room_num,
          'mbti': result[0].mbti
      });
      }
      else{
        res.json({
          'code': resultCode,
          'message': message,
      });
      }
  })
});



app.post('/test1', function(req, res) {
    var pass = [];
    pass.push({id: '1212', password: '1234'});
    pass.push({id: 'dfggg', password: '5678'});
    
    res.json(pass);
});


app.post('/mbti_set', function(req, res) {
  var id = req.body['id'];
  var mbti = req.body['mbti'];

  connection.query('UPDATE user SET mbti = ? WHERE id = ?', [mbti,id], function(err, rows){
    if(!err){
      res.json({message: 'MBTI 등록 성공!'});
    }
  })
});

app.post('/register', function(req, res) {
  id = req.body.id;
  email = req.body.email;
  username = req.body.username;
  password = req.body.password;
  introduce = req.body.introduce;
  age = req.body.age;
  gender = req.body.gender;
  email_auth_flag = req.body.email_auth_flag;
  room_num = req.body.room_num;
  mbti = req.body.mbti;

  var sql_insert = 'INSERT INTO user (id, email, username, password, introduce, age, gender, email_auth_flag, room_num, mbti) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  var param_insert = [id, email, username, password, introduce, age, gender, email_auth_flag, room_num, mbti];
  connection.query(sql_insert, param_insert, function(err, rows, fields){
      if(err) {
          console.log(err);
      } else {
          console.log('Query insert success');
          res.json({message: '회원가입 완료!'});
      }
  });
});

app.post('/post_room', function(req, res) {
  var id = req.body['id'];
  var username = req.body['username'];
  var comment = req.body['comment'];
  var category = req.body['category'];
  
  connection.query('SELECT * from chatroom', function(err, rows){
    if(!err){
      number = rows.length + 1;
      connection.query('INSERT INTO chatroom (room_num, user_id, user_photo, user_name, comment, chatlog_flag, num, max_num, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [number,id, null, username, comment, null, 1, 10, category], function(err, rows){
        if(!err){
          res.json({message: '채팅방 등록 성공!'});
        }
        else{
          res.json({message: '채팅방 등록 실패!'});
        }
      })
    }
  })
});

app.post('/show_room', function(req, res){
  var category = req.body['category'];
  var result = [];
  connection.query('SELECT * from chatroom WHERE category = ?', category, function(err, rows){
    if(!err){
      for(i = 0; i < rows.length; i++){
        result.push({room_num: rows[i].room_num,
                    user_name: rows[i].user_name,
                    comment: rows[i].comment,
                    user_photo: rows[i].user_photo})
      }
      console.log(result)
      res.json(result);
    }
    else{
      console.log('sddf');
    }
  })
});

app.listen(port,function () {
    console.log(`Listening at http://${hostname}:${port}/...`);
});
