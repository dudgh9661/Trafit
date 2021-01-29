var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host    : '27.96.131.37',
    user    : 'root',
    password: 'ckwjdgus',
    database: 'trap'
});
app.use(bodyParser.json({type:'application/json'}));
app.post('/search2', function(req, res){

    var keyword = req.body.keyword;
    var select_date = parseInt(req.body.select_date);
    var sql_search = 'SELECT * FROM chatroom WHERE comment LIKE ?';
    var param_search = ['%'+keyword+'%'];

    conn.query(sql_search, param_search, function(err, rows, fields){
        if(err) {
            console.log(err);
            res.send(err);
        } else{
            console.log(keyword + ' 로 검색한 결과는 다음과 같습니다.');
            for(var i=0; i<rows.length; i++) {
                console.log('comment : ' + rows[i].comment);
                if(parseInt(rows[i].start_date) <= select_date && parseInt(rows[i].end_date) >= select_date) {
                    console.log(i + '번 room num : ' + rows[i].room_num);
                    console.log('start_date : ' + rows[i].start_date);
                    console.log('end_date : ' + rows[i].end_date);
		    console.log('------------------------------');
                }
            }
		res.send('OK');
        }
    });
});

app.listen(3100, function() {
    console.log("JSON 대기 중...");
});
