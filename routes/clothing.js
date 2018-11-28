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


router.get('/', function(req, res, next) {
    res.send('respond clothing');
  });

router.post('/', upload.fields([{name : 'image1'},{name : 'image2'},{name : 'image3'}] ), function(req, res, next){
    models.Clothing.findOne({
        where: {
            cname: req.body.cname
        }
    }).then(function(clothing){
        if (clothing !== null) {

            if (req.files)
              req.body.photo = 'clothing/' + req.files.filename;
            else
              req.body.photo = user.photo;
            req.body.photo
            models.Clothing.create(req.body).then(function(){
              result = {
                  success: true
              };
              res.send(result);
            });
        } else {
            result = {
                success: false,
                text: '이미 존재하는 옷 이름 입니다'
            };
            res.send(result);
        }
    }); 
});

module.exports = router;