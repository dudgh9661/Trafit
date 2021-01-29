// nodemailer를 이용한 이메일 전송

var authFunction = function (userEmail, authKey) {

  var express = require('express');
  var router = express.Router();

  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');
  // var crypto = require('crypto');

  var transporter = nodemailer.createTransport(smtpTransport({ //전송자
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'trafitauth@gmail.com',
      pass: 'trafit123' //계정 비밀번호
    }
  }));

  var mailOptions = {
    from: 'trafitauth@gmail.com',
    to: `${userEmail}`,
    subject: 'Trafit 회원가입 인증 메일 입니다.',
    html: `<h2>인증 번호는\n${authKey}\n입니다.</h2>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

};

module.exports.sendAuthEmail = authFunction;

// var express = require('express');
// var router = express.Router();

// var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');
// var crypto = require('crypto');

// var authKey=crypto.randomBytes(256).toString('base64').substr(100, 5);

// var transporter = nodemailer.createTransport(smtpTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   auth: {
//     user: 'dudgh9661@ajou.ac.kr',
//     pass: ''
//   }
// }));

// var mailOptions = {
//   from: 'dudgh9661@ajou.ac.kr',
//   to: 'dudgh9661@gmail.com',
//   subject: 'Trafit 회원가입 인증 메일 입니다.',
//   html: `<h2>인증 번호는 ${authKey} 입니다.</h2>`
// };

// transporter.sendMail(mailOptions, function(error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// }); 
