var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var sha256 = require('sha256');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/index', function(req, res) {
  res.redirect('/');
});
//login
router.post('/login', function(req, res, next) {
  console.log("asdfasdfasdf");
  models.user.findOne({
    where: {
      userid: req.body.userid,
      pw: sha256(req.body.pw)
    }
  }).then(function(User){
    console.log("qwer"+User);
    if(User !== null) {
      req.session.user = User;
      req.session.user.id = User.id;
      delete req.body.password;
      res.send({
        result: true
      });
    } else{
      res.send({
        result: false
      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  req.session.user = {};
  delete req.session.user;
  
});

router.post('/register', function(req, res, next){
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
  if (req.body.name.length < 1 || req.body.name.length > 10) result = {
      success: false,
      text: '최대 10자리까지 가능합니다.'
  };
  if (req.body.userid.length < 1 || req.body.userid.length > 10) result = {
      success: false,
      text: '학번의 형식이 아닙니다.'
  };
  if (req.body.pw.length < 4 || req.body.pw.length > 10) result = {
      success: false,
      text: '4~10자리 문자열로 입력바랍니다.'
  };
  if (!email_regx.test(req.body.email)) result = {
      success: false,
      text: '이메일 형식이 아닙니다.'
  };
  if (getObjectSize(result) !== 0) res.send(result);
  else{
      models.User.findOne({
          where: {
            userid: req.body.userid
          }
      }).then(function(user){
          if (user === null) {
              req.body.pw = sha256(req.body.pw);
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

router.post('/register/modify', function(req, res, next){
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
  if (req.body.name.length < 1 || req.body.name.length > 10) result = {
      success: false,
      text: '최대 10자리까지 가능합니다.'
  };
  if (req.body.userid.length < 1 || req.body.userid.length > 10) result = {
      success: false,
      text: '학번의 형식이 아닙니다.'
  };
  if (req.body.pw.length < 4 || req.body.pw.length > 10) result = {
      success: false,
      text: '4~10자리 문자열로 입력바랍니다.'
  };
  if (!email_regx.test(req.body.email)) result = {
      success: false,
      text: '이메일 형식이 아닙니다.'
  };
  if (getObjectSize(result) !== 0) res.send(result);
  else{
      models.User.findOne({
          where: {
            userid: req.body.userid
          }
      }).then(function(user){
          if (user === null) {
              req.body.pw = sha256(req.body.pw);
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

module.exports = router;
