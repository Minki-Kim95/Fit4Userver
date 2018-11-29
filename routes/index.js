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
    cb(null, "uploads/");
  },

  // 서버에 저장할 파일 명
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({ storage: storage });

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
      req.session.user.id = user.id;
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
//logout
router.get('/logout', function(req, res, next) {
  req.session.user = {};
  delete req.session.user;
  if(req.session.user == null){
    res.send({
      success: true
    });
  }else{
    res.send({
      success: false
    });
  }
});

//image upload
router.post('/upload', upload.single('image'), function (req, res, next) {

  console.log("Request Get img upload");

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(
      { success : true, 
        filename : req.file.filename }
  ));

});

//image load
router.get('/loadimage/:imagedir/:filename', function (req, res){
  var imagedir = req.params.imagedir;
  var filename = req.params.filename
  fs.readFile('uploads/' + imagedir + '/' + filename, function (error, data) {
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.end(data);
  });
});


module.exports = router;
