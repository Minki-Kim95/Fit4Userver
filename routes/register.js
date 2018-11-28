var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var sha256 = require('sha256');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
//multer
var multer = require('multer');
var storage = multer.diskStorage({
  // 서버에 저장할 폴더
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
  },

  // 서버에 저장할 파일 명
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({ storage: storage });


//회원정보 입력
router.post('/', upload.single('image'), function(req, res, next){
  var result = {};
  var num_regx = /^[0-9]*$/;
  var email_regx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // var image_extention_regx = /\.(gif|jpg|jpeg|tiff|png)$/i;

  function getObjectSize(obj) {
      var size = 0;
      for (var key in obj)
          if (obj.hasOwnProperty(key)) size++;
      return size;
  }
  if (req.body.uname.length < 1 || req.body.uname.length > 10){
    res.send({
        success: false,
        text: '실명은 최대 10자리까지 가능합니다.'
    });
  }
  if (req.body.nickname.length < 1 || req.body.nickname.length > 10){
    res.send({
        success: false,
        text: '닉네임은 최대 10자리까지 가능합니다.'
    });
  }
  if (req.body.pw.length < 4 || req.body.pw.length > 10){
    res.send({
      success: false,
      text: '4~10자리 문자열로 입력바랍니다.'
    });
  }
  if (!email_regx.test(req.body.email)){
    res.send({
      success: false,
      text: '이메일 형식이 아닙니다.'
    });
  }
  else{
      models.User.findOne({
          where: {
            userid: req.body.userid
          }
      }).then(function(user){
          if (user === null) {
              req.body.pw = sha256(req.body.pw);
              req.body.photo = 'profile/'+ req.file.filename;
              models.User.create(req.body).then(function(){
                result = {
                    success: true
                };
                res.send(result);
              });
          } else {
              result = {
                  success: false,
                  text: '이미 존재하는 아이디 입니다.'
              };
              res.send(result);
          }
      }); 
  }
});
// 회원정보 수정
router.post('/modify', upload.single('image'), function(req, res, next){
  console.log(req.body);
  var result = {};
  var num_regx = /^[0-9]*$/;
  var email_regx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // var image_extention_regx = /\.(gif|jpg|jpeg|tiff|png)$/i;

  function getObjectSize(obj) {
      var size = 0;
      for (var key in obj)
          if (obj.hasOwnProperty(key)) size++;
      return size;
  }
  if (req.body.uname.length < 1 || req.body.uname.length > 10){
    res.send({
        success: false,
        text: '실명은 최대 10자리까지 가능합니다.'
    });
  }
  if (req.body.nickname.length < 1 || req.body.nickname.length > 10){
    res.send({
        success: false,
        text: '닉네임은 최대 10자리까지 가능합니다.'
    });
  }
  if (req.body.pw.length < 4 || req.body.pw.length > 10){
    res.send({
      success: false,
      text: '4~10자리 문자열로 입력바랍니다.'
    });
  }
  if (!email_regx.test(req.body.email)){
    res.send({
      success: false,
      text: '이메일 형식이 아닙니다.'
    });
  }
  else{
      models.User.findOne({
          where: {
            userid: req.body.userid,
            pw : sha256(req.body.pw)
          }
      }).then(function(user){
          if (user !== null) {
              req.body.pw = sha256(req.body.pw);
              if (req.file)
                req.body.photo = 'profile/' + req.file.filename;
              else
                req.body.photo = user.photo;
              req.body.photo
              user.updateAttributes(req.body).then(function(){
                result = {
                    success: true
                };
                res.send(result);
              });
          } else {
              result = {
                  success: false,
                  text: '이미 존재하는 아이디 입니다.'
              };
              res.send(result);
          }
      }); 
  }
  
});

//회원정보 삭제
router.post('/delete', function(req, res, next) {
  console.log(req.body);
  models.User.findOne({
    where: {
      userid: req.body.userid,
      pw: sha256(req.body.pw)
    }
  }).then(function(user){
    if(user !== null) {
      user.destroy();
      res.send({
        success: true
      });
    } else{
      res.send({
        success: false
      });
    }
  });
});

module.exports = router;
