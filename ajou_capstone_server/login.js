var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, 'localhost', function () {
    console.log('서버 실행 중...');
});

var connection = mysql.createConnection({
    host: "27,96,131.37",
    user: "hong",
    database: "trap",
    password: "ckwjdgus",
    port: 13306
});

app.post('/user/login', function (req, res) {
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
                message = '로그인 성공! ' + result[0].id + '님 환영합니다!';
            }
        }

        res.json({
            'code': resultCode,
            'message': message,
            'result' : result[0]
        });
    })
});
