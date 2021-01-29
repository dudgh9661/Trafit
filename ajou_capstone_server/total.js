var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mysql = require('mysql');
var storage;
var crypto = require('crypto');
var path = require('path');
var sha256 = require('sha256');
var app = express();
var admin = require('firebase-admin');
var serviceAccount = require('/root/fcm_node/functions/fcm_key.json');


const http = require('http').createServer(app);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

var emailAuth = require('./email_test/emailAuth.js');
const { isRegExp } = require('util');
app.use('/emailauth', emailAuth);


app.post('/leave_room', function(req, res) {
    var id = req.body['id'];
    var roomNumber = req.body['room_num'];
    var isboss = req.body['isboss'];
    var room = req.body['room'];

    if(isboss==false){
      connection.query('UPDATE user SET room_num = ? WHERE id = ?', [roomNumber, id], function(err, rows) {
          if (err) {
            res.json({'message': '실패!'});
          } else {
          connection.query('DELETE FROM chat_userlist WHERE room = ? AND id = ?;', [room, id]);
          }
      });
    }
    else{
        connection.query('DELETE FROM chatroom WHERE room_num = ?',[room]);
        connection.query('DELETE FROM chat_userlist WHERE room = ?',[room]);

        connection.query('SELECT * from user', function(err, rows){
          if(!err){
            for(i = 0; i < rows.length; i++){
              console.log(i);
              var sql_detete_room = "UPDATE user SET room_num = (SELECT * FROM (SELECT REPLACE(room_num, ',?' , '') FROM user where pk = ?) as t) where pk = ?;";
              var param_delete_room = [room, i, i];
              console.log(param_delete_room);
              connection.query(sql_detete_room,param_delete_room);
              connection.query("UPDATE user SET room_num = (SELECT * FROM (SELECT REPLACE(room_num, '?' , '') FROM user where pk = ?) as t) where pk = ?;", [room, i, i], function(err,rowa) {
                    if(!err){
                      console.log('check_2');
                    }
                  })
            }
          }
          else{
            console.log('실패!');
          }
        })
    }
});

app.post('/upload',multer({storage: storage}).single('image'),function(req,res){
    connection.query('UPDATE user SET img = ? WHERE id = ?', [req.file.filename, req.body.id], function(err, rows){
      if(!err){
        res.send({message: '사진 등록 성공!', img: req.file.filename});
      }
      else{
        res.send({message: '사진 등록 실패!'});
      }
    })
})


app.post('/id_check', function(req, res){
  id = req.body.id;
  var sql_check_id = 'SELECT * FROM user where id=?';
  var param_check_id = [id];
  connection.query(sql_check_id, param_check_id, function(err, rows, fields){
      if(err) {
          console.log(err);
      } else if(rows[0]!=undefined){
          console.log('ID : '+ id +' has founded.');
          res.send('중복됨'); //ID 중복됨
      } else{
          console.log('ID : '+ id +' has not founded.');
          res.send('중복되지 않음'); //ID 중복되지 않음
      }
  });
});

app.post('/email_check', function(req, res){
  email = req.body.email;
  var sql_check_email = 'SELECT * FROM user where email=?';
  var param_check_email = [email];
  connection.query(sql_check_email, param_check_email, function(err, rows, fields){
      if(err) {
          console.log(err);
      } else if(rows[0]!=undefined){
          console.log('Email : '+ email +' has founded.');
          res.send('중복됨'); //Email 중복됨
      } else{
          console.log('Email : '+ email +' has not founded.');
          res.send('중복되지 않음'); //Email 중복되지 않음
      }
  });
});


app.post('/deny_check', function(req, res){
  id = req.body.id;
  room = req.body.room;
  var sql_check_room = 'SELECT * FROM denied_list where room_num = ? AND id = ?';
  var param_check_room = [room, id];
  connection.query(sql_check_room, param_check_room, function(err, rows, fields){
      if(err) {
          console.log(err);
      } else if(rows[0]!=undefined){
          console.log('deny에 있음' + room, id);
          res.send({'message': true}); //ID 중복됨
      } else{
          console.log('deny에 없음' + room, id);
          res.send({'message': false}); //ID 중복되지 않음
      }
  });
});


app.post('/login_check', function (req, res) {
  var userid = req.body.id;
  var userPwd = sha256(req.body.password);
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
      if(resultCode==200){//로그인 성공시
        res.json({
          'code': resultCode,
          'message': message,
          'username': result[0].username,
          'introduce': result[0].introduce,
          'age': result[0].age,
          'gender': result[0].gender,
          'room_num': result[0].room_num,
          'mbti': result[0].mbti,
          'img': result[0].img
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
  var param_insert = [id, email, username, sha256(password), introduce, age, gender, email_auth_flag, room_num, mbti];
  connection.query(sql_insert, param_insert, function(err, rows, fields){
      if(err) {
          console.log(err);
      } else {
          console.log('Query insert success');
          res.json({message: '회원가입 완료!'});
      }
  });
  connection.query("ALTER TABLE user AUTO_INCREMENT=1;");
  connection.query("SET @COUNT = -1;");
  connection.query("UPDATE user SET pk = @COUNT:=@COUNT+1;");
});

app.post('/post_room',function(req,res) {
  var id = req.body['id'];
  var username = req.body['username'];
  var comment = req.body['comment'];
  var category = req.body['category'];
  var date = req.body['date'];
  var mbti = req.body['mbti'];
  var img = req.body['img'];
  var start_date = req.body['start_date'];
  var end_date = req.body['end_date'];
  connection.query('SELECT * from chatroom', function(err, rows){
    if(!err){
      connection.query('INSERT INTO chatroom (boss, bossname, bossmbti, comment, num, max_num, category, img, date, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, username, mbti, comment, 1, 10, category, img, date, start_date, end_date], function(err, rows){
        if(!err){
          res.json({message: '채팅방 등록 성공!'});
        }
        else{
          console.log(err);
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
                    bossname: rows[i].bossname,
                    bossmbti: rows[i].bossmbti,
                    comment: rows[i].comment,
                    img: rows[i].img,
                    date: rows[i].date,
                    start_date: rows[i].start_date,
                    end_date: rows[i].end_date}
        )
      }
      res.json(result);
    }
    else{
      console.log('실패!');
    }
  })
});

app.post('/search_room', function(req, res){
  var keyword = req.body['keyword'];
  var result = [];
  connection.query('SELECT * from chatroom', function(err, rows){
    if(!err){
      for(i = 0; i < rows.length; i++){
        result.push({room_num: rows[i].room_num,
                    category: rows[i].category,
                    bossname: rows[i].bossname,
                    bossmbti: rows[i].bossmbti,
                    comment: rows[i].comment,
                    img: rows[i].img,
                    date: rows[i].date,
                    start_date: rows[i].start_date,
                    end_date: rows[i].end_date})
      }
      res.json(result);
    }
    else{
      res.json({'message': '실패!'});
      console.log('실패!');
    }
  })
});

app.post('/show_profile', function(req, res){
  var id = req.body['id'];

  connection.query('SELECT * from user WHERE id = ?', id, function(err, rows){
    if(!err){
        res.json({
          'message': '프로필 불러오기 성공!',
          'email': rows[0].email,
          'username': rows[0].username,
          'introduce': rows[0].introduce,
          'age': rows[0].age,
          'gender': rows[0].gender,
          'room_num': rows[0].room_num,
          'mbti': rows[0].mbti
        })
    }
    else{
      res.json({message: '프로필 불러오기 실패!'})
    }
  })
});

app.post('/user_in_room', function(req, res){
  var room_num = req.body['room_num'];
  var result = [];
  if(req.body['room_num']==null)res.json(result);
  else{
    var room_list = room_num.split(',');
    var room_list2 = room_list.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b); return a;},[]);
    connection.query('SELECT * from chatroom', function(err, rows){
      if(!err){
        for(j=0; j< room_list2.length; j++){
           for(i = 0; i < rows.length; i++){
        if(room_list2[j]==rows[i].room_num){
              result.push({room_num: rows[i].room_num,
                          category: rows[i].category,
                          boss: rows[i].boss,
                              bossname: rows[i].bossname,
                               bossmbti: rows[i].bossmbti,
                               comment: rows[i].comment,
                               img: rows[i].img,
                               date: rows[i].date,
                start_date: rows[i].start_date,
                end_date: rows[i].end_date})
   }
      }
}
      res.json(result);
    }
    else{
      res.json({'message': '실패!'});
    }

  })
}
});

app.post('/enter_room', function(req, res){
  var id = req.body['id'];
  var username = req.body['username'];
  var room = req.body['room'];
  var mbti = req.body['mbti'];
  var img = req.body['img'];
  var token = req.body['token']
  var result = [];

  connection.query('SELECT * from user where id = ?', id, function(err, rows){
    if(!err){
      if((rows[0].room_num == null)||(!rows[0].room_num.includes(String(room)))){
        if(rows[0].room_num == null){
          connection.query('UPDATE user SET room_num = ? WHERE id = ?', [String(room), id])
        }
        else{
          connection.query('UPDATE user SET room_num = concat(room_num,?) WHERE id = ?', [','+String(room), id])
        }
      }
    }
  })

  connection.query('SELECT * from chat_userlist WHERE room = ? AND id = ?', [room, id], function(err, rows){
    if(!err){
      if(rows.length == 0){
        connection.query('INSERT INTO chat_userlist (room, id, username, mbti, img, token) VALUES (?, ?, ?, ?, ?, ?)', [room, id, username, mbti, img, token],function(err, rows){
          console.log(err);
          connection.query('SELECT * from chat_userlist WHERE room = ?', room, function(err,rows){
            if(!err){
              for(i=0;i<rows.length;i++){
                result.push({
                  'id': rows[i].id,
                  'username': rows[i].username,
                  'mbti': rows[i].mbti,
                  'img': rows[i].img,
                  'token': rows[i].token
                })
              }
              console.log(result);
              res.json(result);

            }
          })
        })
      }
      else{
        connection.query('SELECT * from chat_userlist WHERE room = ?', room, function(err,rows){
          if(!err){
            for(i=0;i<rows.length;i++){
              result.push({
                'id': rows[i].id,
                'username': rows[i].username,
                'mbti': rows[i].mbti,
                'img': rows[i].img,
                'token': rows[i].token
              })
            }
            res.json(result);
          }
        })
      }
    }
  })
});

app.post('/room_info', function(req, res){
  var room = req.body['room'];
  connection.query('SELECT * from chatroom WHERE room_num = ?', room, function(err, rows){
    if(!err){
      res.json({
        'boss': rows[0].boss,
        'bossname': rows[0].bossname,
        'bossmbti': rows[0].bossmbti,
        'img': rows[0].img
      })
    }
  })
})

app.post('/report', function(req, res){
  var id = req.body['id'];
  var toid = req.body['toid'];
  var type = req.body['type'];
  var comment = req.body['comment'];
  var date = req.body['date'];

  connection.query('INSERT INTO report (id, toid, type, comment, date)  VALUES (?, ?, ?, ?, ?)', [id, toid, type, comment, date],function(err, rows){
    if(!err){
      res.json({
        message: '신고 등록 완료!'
      })
    }
  })
});
app.post('/comments', function(req, res){
  var id = req.body['id'];
  var username = req.body['username'];
  var mbti = req.body['mbti'];
  var img = req.body['img'];
  var toid = req.body['toid'];
  var comment = req.body['comment'];

  connection.query('INSERT INTO comment (id, username, mbti, img, toid, comment) VALUES (?, ?, ?, ?, ?, ?)',[id, username, mbti, img, toid, comment], function(err, rows){
    if(!err){
      res.json({
        message: '평가 등록 완료!'
      })
    }
    else{
      res.json({
        message: '평가 등록 실패!'
      })
    }
  })
});

app.post('/show_comment', function(req, res){
  var id = req.body['id'];
  result = [];

  connection.query('SELECT * from comment WHERE toid = ?', id, function(err, rows){
    if(!err){
      for(i=0; i<rows.length; i++){
        result.push({'id': rows[i].id,
                    'username': rows[i].username,
                    'mbti': rows[i].mbti,
                    'img': rows[i].img,
                    'comment': rows[i].comment})
      }
      res.json(result);
    }
  })
});

app.post('/send_token', function(req, res){
  var token = req.body['token'];
  var room_num = req.body['room_num'];
  var result = [];
  console.log("통신 성공");
  connection.query('SELECT * FROM chatroom where room_num = ?', room_num, function(err, rows){
    if(!err){
      if((rows[0].token == null)||(!rows[0].token.includes(String(token)))){
        if(rows[0].token == null){
          connection.query('UPDATE chatroom SET token = ? WHERE room_num = ?',[String(token), room_num])
        }
        else{
          connection.query('UPDATE chatroom SET token = concat(token, ?) WHERE room_num = ?', [','+String(token), room_num])
        }

      }
        res.json({'message': '성공'})
    }
        else{
        res.json({'message': '실패'})
        }

  })


});

app.post('/send_message', function(req,res){
  var fcm_target_token = req.body['token'];
  var message = req.body['message'];
  var name = req.body['name'];
  var fcm_message = {
    notification:{
      title: name,
      body: message
    },
    data:{
      fileno:'44',
      style:'good!!'
    },
    token: fcm_target_token
  };
  admin.messaging().send(fcm_message)
    .then(function(response){
      console.log('보내기 성공 메시지:' + response);
      res.json({'message': '성공!'});
    })
    .catch(function(error){
      console.log('보내기 실패 메시지:' + error);
    });

});




app.use(express.static(__dirname + '//uploads//'))

app.listen(3001, function () {
    console.log('Server Start!....');
});

