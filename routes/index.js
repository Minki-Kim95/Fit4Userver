var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var sha256 = require('sha256');
var router = express.Router();
var mysql = require('mysql');
//multer
var multer = require('multer');
var storage = multer.diskStorage({
  // 서버에 저장할 폴더
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  // 서버에 저장할 파일 명
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

// var upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/index', function(req, res) {
  res.redirect('/');
});
//login
router.post('/login', function(req, res, next) {
  models.User.findOne({
    where: {
      userid: req.body.userid,
      pw: sha256(req.body.pw)
    }
  }).then(function(user){
    if(user !== null) {
      req.session.user = user;
      req.session.user.userid = user.userid;
      delete req.body.password;
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

router.get('/logout', function(req, res, next) {
  req.session.user = {};
  delete req.session.user;
  if(req.session.user == null){
    res.send({
      success: true,
      msg: 'logout'
    });
  }else{
    res.send({
      success: false,
      msg: 'logout fail'
    });
  }
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
  if (req.body.userid.length < 1 || req.body.userid.length > 10){
    res.send({
        success: false,
        text: '학번의 형식이 아닙니다.'
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

router.post('/posts', upload.single('image'), function (req, res, next) {

  console.log("Request Get img upload");

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(
      { result : "success" }
  ));

});

router.post('/upload',function(req,res){ 

  console.log("Request upload!");
  
  var name = "";
  var filePath = "";
  var form = new formidable.IncomingForm();
  
  form.parse(req, function(err, fields, files) {
      name = fields.name;
  });
  
  form.on('end', function(fields, files) {
    for (var i = 0; i < this.openedFiles.length; i++) {
      var temp_path = this.openedFiles[i].path;
      var file_name = this.openedFiles[i].name;
      var index = file_name.indexOf('/'); 
      var new_file_name = file_name.substring(index + 1);
       
      var new_location = 'uploads/'+name+'/';
  
      fs.copy(temp_path, new_location + file_name, function(err) { // 이미지 파일 저장하는 부분임
        if (err) {
          console.error(err);
  
          console.log("upload error!");
        }
        else{      
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ result : "success", url : new_location+file_name }, null, 3));
  
          console.log("upload success!");
        }
      });
    }
  
  });
  });

// router.post('/upload', function(req, res) {
// 	console.log(req.files.image.originalFilename);
// 	console.log(req.files.image.path);
// 		fs.readFile(req.files.image.path, function (err, data){
// 		var dirname = "/home/rajamalw/Node/file-upload";
// 		var newPath = dirname + "/uploads/" + 	req.files.image.originalFilename;
// 		fs.writeFile(newPath, data, function (err) {
//       if(err){
//       res.json({'response':"Error"});
//       }else {
//       res.json({'response':"Saved"});
//       }
//     });
//   });
// });


// router.get('/uploads/:file', function (req, res){
//   file = req.params.file;
//   console.log(file);
//   var dirname = "C:\Users\SLAVE1\Desktop";
//   //var img = fs.readFileSync(dirname + "/uploads/" + file);
//   //var img = fs.readFileSync(dirname + "\"" + file);
//   var img = fs.readFileSync("C:\Users\SLAVE1\Desktop\jojojo.jpg");
//   console.log(img)
//   res.writeHead(200, {'Content-Type': 'image/jpg' });
//   res.end(img, 'binary');
// });


module.exports = router;
