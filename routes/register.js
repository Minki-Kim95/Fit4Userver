var express = require('express');
var models = require('../models');
var sha256 = require('sha256');
var router = express.Router();
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

  if (req.body.uname.length < 1 || req.body.uname.length > 10){
    res.send({
        success: false,
        text: '실명은 최대 10자리까지 가능합니다.'
    });
  }
  else if (req.body.nickname.length < 1 || req.body.nickname.length > 10){
    res.send({
        success: false,
        text: '닉네임은 최대 10자리까지 가능합니다.'
    });
  }
  else if (req.body.pw.length < 4 || req.body.pw.length > 10){
    res.send({
      success: false,
      text: '4~10자리 문자열로 입력바랍니다.'
    });
  }
  else if (!email_regx.test(req.body.email)){
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
              if(typeof req.file !== 'undefined')
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
  var result = {};
  var num_regx = /^[0-9]*$/;
  var email_regx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // var image_extention_regx = /\.(gif|jpg|jpeg|tiff|png)$/i;

  if (req.body.uname.length < 1 || req.body.uname.length > 10){
    res.send({
        success: false,
        text: '실명은 최대 10자리까지 가능합니다.'
    });
  }
  else if (req.body.nickname.length < 1 || req.body.nickname.length > 10){
    res.send({
        success: false,
        text: '닉네임은 최대 10자리까지 가능합니다.'
    });
  }
  else if (req.body.pw.length < 4 || req.body.pw.length > 10){
    res.send({
      success: false,
      text: '4~10자리 문자열로 입력바랍니다.'
    });
  }
  else if (!email_regx.test(req.body.email)){
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
              if (typeof req.file !== 'undefined')
                req.body.photo = 'profile/' + req.file.filename;
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
  models.User.findOne({
    where: {
      userid: req.body.userid,
      pw: sha256(req.body.pw)
    }
  }).then(function(user){
    if(user !== null) {
      user.destroy().then(function(){
        res.send({
          success: true
        });
      });
    } else{
      res.send({
        success: false
      });
    }
  });
});

router.post('/getinfo', (req, res, next) =>{
  if (typeof req.session.user !== 'undefined'){
    models.User.findOne({
      where:{
        id: req.session.user.id
      },
      attributes: { exclude: ['pw']}
      // attributes: ['id', 'userid', 'uname', 
      // 'nickname', 'gender', 'height', 'shoulder','topsize', 
      // 'down_length','waist', 'weight', 'photo', 'intro', 
      // 'email','head_width','head_height', 'createdAt']
    }).then(function(user){
      res.send(user);
    });
  }else{
      res.send({
          success: false,
          text: "로그인이 안되있습니다"
      });
  }
  
});

module.exports = router;
