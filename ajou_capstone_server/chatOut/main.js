var mysql = require('mysql');

var express = require('express');

var bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));

var app = express();

var connection = mysql.createConnection({
    host: "27.96.131.37",
    user: "hong",
    database: "trap",
    password: "ckwjdgus"
});

app.post('/leave_room', (res, req) => {
    var post = req.body;
    var id = post['id'];
    var roomNumber = post['roomNumber'];

    connection.query('UPDATE chatroom SET room_num = ? WHERE user_id = ?', [roomNumber, id], function(err, res, field) {
        if (err) {
            console.log(err);
            console.log("DELETE query문에서 에러");
        } else {
            console.log(res);
            console.log("update 성공");
        }
    });
});