// url ' /emailAuth ' 

var express = require('express');
var fs = require('fs');
var crypto = require('crypto');
var authFunction = require('./authFunc.js');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host    : '27.96.131.37',
    user    : 'root',
    password: 'ckwjdgus',
    database: 'trap'
});
var router = express.Router();


// --------------------------------------------------------
//var authKey = crypto.randomBytes(256).toString('base64').substr(100, 5);//시스템에서 보낸 인증코드 
var isReauth = false; 

var authKey = '';

router.post('/', (req, res)=>{ // url : ' /emailauth '

    var emailId = req.body["email"]; //user가 입력한 emailId

    console.log(" 재인증 : "+ isReauth); // 재인증 여부 출력

    if( !(isReauth) ) { //만약 인증번호 재인증을 하는 것이 아니라면,
	 authKey = crypto.randomBytes(256).toString('base64').substr(100, 5);//시스템에서 보낸 인증코드 
        authFunction.sendAuthEmail(emailId, authKey); //인증 메일을 보낸다.
        //isReauth = true; //인증번호가 틀려서 다시 이 페이지로 왔을때, authFunc가 다시 실행되는 것을 방지
    }
    fs.readFile('./views/authProcess.html', (err, data)=> {
        res.end(data);
    });
});

router.post('/authprocess', (req, res)=>{  // url : ' /emailauth/authprocess '
    var inputAuthcode = req.body["authCode"]; //사용자가 입력한 인증코드
    
    console.log("유저가 입력한 인증 코드 : " + inputAuthcode);
    console.log("시스템에서 보낸 인증 코드 : " + authKey); //시스템에서 보낸 인증코드 

    if( inputAuthcode == authKey ) { //인증코드가 일치하다면,
        res.send("인증성공");
	isReauth = false;
    } else { //일치하지 않는다면,
        console.log("인증실패!!");
	isReauth = true;
        res.redirect(307, '/emailauth'); // ' /emailauth ' 로 가서 재인증을 시킨다.
    }
});

module.exports = router;
