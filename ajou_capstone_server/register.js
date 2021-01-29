var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var sha256 = require('sha256'); //kisa 암호화 조치 안내서(17.02)에 따른 SHA256 암호화
var conn = mysql.createConnection({
    host    : '27.96.131.37',
    user    : 'root',
    password: 'ckwjdgus',
    database: 'trap'
});

var id, email, password, introduce, age, gender, email_auth_flag, room_num, mbti;
app.use(bodyParser.json({type:'application/json'}));
app.post('/register', function(req, res) {
    id = req.body.id;
    email = req.body.email;
    password = req.body.password;
    username = req.body.username;
    introduce = req.body.introduce;
    age = req.body.age;
    gender = req.body.gender;
    email_auth_flag = req.body.email_auth_flag;
    room_num = req.body.room_num;
    mbti = req.body.mbti;

    var sql_insert = 'INSERT INTO user (id, email, username, password, introduce, age, gender, email_auth_flag, room_num, mbti) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var param_insert = [id, email, username, sha256(password), introduce, age, gender, email_auth_flag, room_num, mbti];
    conn.query(sql_insert, param_insert, function(err, rows, fields){
        if(err) {
            console.log(err);
        } else {
            console.log('Query insert success');
            res.send('정상적으로 회원가입이 완료되었습니다.');
        }
    });
});

app.post('/id_check', function(req, res){
    id = req.body.id;
    var sql_check_id = 'SELECT * FROM user where id=?';
    var param_check_id = [id];
    conn.query(sql_check_id, param_check_id, function(err, rows, fields){
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
    conn.query(sql_check_email, param_check_email, function(err, rows, fields){
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

app.post('/login_check', function(req, res){
    id = req.body.id;
    password = req.body.password;

    var sql_login_check = 'SELECT * FROM user where id=? AND password=?';
    var param_login_check = [id,sha256(password)];
    conn.query(sql_login_check, param_login_check, function(err, rows, fields){
        if(err) {
            console.log(err);
        } else if(rows[0]!=undefined){
            username = rows[0].username;
            email = rows[0].email;
            introduce = rows[0].introduce;
            age = rows[0].age;
            gender = rows[0].gender;
            room_num = rows[0].room_num;
            mbti = rows[0].mbti;
            img = rows[0].img;
            console.log('{"id":'+'"'+id+'"'+',"email":'+'"'+email+'"'+',"username":'+'"'+username+'"'+',"introduce":'+'"'+introduce+'"'+',"age":'+'"'+age+'"'+',"gender":'+'"'+gender+'"'+',"room_num":'+'"'+room_num+'"'+',"mbti":'+'"'+mbti+'"'+',"img":'+'"'+img+'"'+'}');
            res.send('{"id":'+'"'+id+'"'+',"email":'+'"'+email+'"'+',"username":'+'"'+username+'"'+',"introduce":'+'"'+introduce+'"'+',"age":'+'"'+age+'"'+',"gender":'+'"'+gender+'"'+',"room_num":'+'"'+room_num+'"'+',"mbti":'+'"'+mbti+'"'+',"img":'+'"'+img+'"'+'}'); //로그인 성공
        } else{
            console.log('로그인 실패');
            res.send('로그인 실패'); //로그인 실패
        }
    });
});

app.post('/room_insert', function(req, res){
    id = req.body.id;
    room_num = req.body.room_num;
    
    var sql_room_check = 'SELECT * FROM chatroom where room_num=?';
    var param_room_check = [room_num]; //room_num이 이미 존재하는지 check

    var sql_room_insert_exist = 'UPDATE chatroom SET user_id=concat(user_id, ?) where room_num=?';
    var param_room_insert_exist = [','+ id, room_num]; //room_num이 존재하면 id만 기존 data에 concat해서 update

    var sql_room_insert_null = 'INSERT INTO chatroom (room_num, user_id) VALUES (?, ?)';
    var param_room_insert_null = [room_num, id]; //room_num이 존재하지 않을 때 insert

    conn.query(sql_room_check, param_room_check, function(err, rows, fields){
        if(err) {
            console.log(err);
            res.send(err);
        } else if(rows[0]!=undefined){ //room_num이 이미 존재하면
            console.log('room_num : ' + room_num + '은 이미 존재합니다.');
            console.log('data를 update 합니다.');
            conn.query(sql_room_insert_exist, param_room_insert_exist, function(err2, rows2, fields2){
                console.log('room_num : ' + room_num + ' 에 id : ' + id + ' 가 추가되어 update 되었음');
                res.send('room_num : ' + room_num + ' 에 id : ' + id + ' 가 추가되어 update 되었음');
            });
        } else{ //room_num가 존재하지 않는다면 room_num과 id 를 insert
            conn.query(sql_room_insert_null, param_room_insert_null, function(err3, rows3, fields3){
                console.log('room_num : ' + room_num + ' 와 id : ' + id + ' 가 신규 추가되어 insert 되었음');
                res.send('room_num : ' + room_num + ' 와 id : ' + id + ' 가 신규 추가되어 insert 되었음');
            });
        }
    });
});

app.post('/search', function(req, res){
    var select_date = req.body['select_date'];
    var keyword = req.body['keyword'];

    var sql_search = 'SELECT * FROM chatroom WHERE comment LIKE ?';
    var param_search = ['%' + keyword + '%', select_date];

    conn.query(sql_search, param_search, function(err, rows, fields){
        if(err) {
            console.log(err);
            res.send(err);
        } else{
            console.log(keyword + ' 로 검색한 결과는 다음과 같습니다.');
            for(i=0; i<rows.length; i++) {
                console.log(i + '번 row 값 : ' + rows[i]);
                res.send('OK')
            }
        }
    });
});

app.listen(3100, function() {
    console.log("JSON 대기 중...");
});