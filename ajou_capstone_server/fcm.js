var admin = require('firebase-admin');
var serviceAccount = require('../server/fcm_key.json');
var express=require('express');
var fs=require('fs');
var app=express();
var mysql= require('mysql');
const http = require('http').createServer(app)

admin.initializeApp({
        credential : admin.credential.cert(serviceAccount)
});

var connection = mysql.createConnection({
  host : '27.96.131.37',
  user     : 'hong',
  password : 'ckwjdgus',
  database : 'trap'

});

app.set('port', process.env.PORT || 3002);

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

app.get('/fcm', (req, res) => {
        /* client_token은 클라이언트에서 받도록 한다. */
        var client_token = req.body.client_token;

        /** 발송할 Push 메시지 내용 */
        var push_data = {
            // 수신대상
            to: client_token,
            // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
            notification: {
                title: req.body.title,
                body: req.body.message,
                sound: "default",
                click_action: "FCM_PLUGIN_ACTIVITY",
                icon: "fcm_push_icon"
            },
            // 메시지 중요도
            priority: "high",
            // App 패키지 이름
            restricted_package_name: "study.cordova.fcmclient",
            // App에게 전달할 데이터
            data: {
                num1: 2000,
                num2: 3000
            }
        };

        /** 아래는 푸시메시지 발송절차 */
        var fcm = new FCM(serverKey);

        fcm.send(push_data, function(err, response) {
            if (err) {
                console.error('Push메시지 발송에 실패했습니다.');
                console.error(err);
                return;
            }

            console.log('Push메시지가 발송되었습니다.');
            console.log(response);
        });
});


app.get('/roomuser',(req, res)=>{
                var result = [];
                var word;
        connection.query('SELECT * from user', function(err, rows, fields) {
          if (!err)
            {
                for(i = 0; i < rows.length; i++){
                        word = String(rows[i].room_num).split(',');
                        console.log(word);
                        }
                        res.json(result);

            }
          else{
            console.log('Error while performing Query.', err);
          }
        });

});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
