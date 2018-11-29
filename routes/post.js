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
    cb(null, "uploads/post");
  },

  // 서버에 저장할 파일 명
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({ storage: storage });


router.get('/', function(req, res, next) {
    res.send('respond post');
  });
//post 등록
router.post('/', upload.single('image'), (req, res, next) => {
    //hashtag, image(file)
    if (typeof req.session.user === 'undefined'){
        res.send({
            success: false,
            text: "로그인이 안되있습니다"
        });
    }else{
        if (req.body.hashtag.length < 1 || req.body.hashtag.length > 255){
            res.send({
                success: false,
                text: '해쉬태그는 255자까지 가능합니다'
            });
        }
        else{
            req.body.uid = req.session.user.id;
            req.body.views = 0;
            if (typeof req.file === 'undefined'){
                res.send({
                    success: false,
                    text: '이미지는 필수입니다'
                });
            }else{
                req.body.photo = 'post/' + req.file.filename;
                models.Post.create(req.body).then(function(){
                    result = {
                        success: true
                    };
                    res.send(result);
                });
            }
                
        }
    }
});
//해당 옷의 상세 정보
router.get('/specific/:pid', (req, res, next) =>{
    models.Post.findOne({
        where: {
            id: req.params.pid
        }
     }).then(function(post){
        if (post !== null) {
            models.Post.update(
                {views: post.views + 1},
                {where: {
                    id: req.params.pid
                }}
            ).then(function(){
                models.Post_like_relation.findAll({
                    where:{
                        pid: req.params.pid
                    }
                }).then(function(likenum){
                    var i = 0;
                    while(typeof likenum[i] !== 'undefined')
                        i++;
                    if(typeof req.session.user !== 'undefined'){
                        models.Post_like_relation.findOne({
                            where:{
                                pid: req.params.pid,
                                uid: req.session.user.id
                            }
                        }).then(function(like){
                            if(like !== null)
                                islike = true;
                            else
                                islike = false;
                            res.send({
                                id: post.id,
                                views: post.views,
                                hashtag: post.hashtag,
                                photo: post.photo,
                                createdAt: post.createdAt,
                                uid: post.uid,
                                like: i,
                                Islike: islike
                            });
                        });
                    }else{
                        res.send({
                            id: post.id,
                            views: post.views,
                            hashtag: post.hashtag,
                            photo: post.photo,
                            createdAt: post.createdAt,
                            uid: post.uid,
                            like: i,
                            Islike: false
                        });
                    }
                });
            });
        } else {
            result = {
                success: false,
                text: '존재하지 않는 스타일 정보입니다'
            };
            res.send(result);
        }
    }); 
});
router.post('/modify/:pid',upload.single('image'), (req, res, next)=>{
    if (typeof req.session.user === 'undefined'){
        res.send({
            success: false,
            text: "로그인이 안되있습니다"
        });
    }else{
        models.Post.findOne({
            where:{
                id: req.params.pid
            }
        }).then(function(post){
            if (post !== null){
                if (typeof req.body.hashtag !== 'undefined' && (req.body.hashtag.length < 1 || req.body.hashtag.length > 255)){
                    res.send({
                        success: false,
                        text: '해쉬태그는 255자까지 가능합니다'
                    });
                }
                else{
                    if (typeof req.file.image !== 'undefined')
                        req.body.photo = 'post/' + req.file.filename;
                    if (post.uid !== req.session.user.id){
                        res.send({
                            success: false,
                            text: '권한이 없습니다'
                        });
                    }else{
                        console.log(req.body);
                        post.updateAttributes(req.body).then(function(){
                            result = {
                                success: true
                            };
                            res.send(result);
                        });
                    }
                }
            }else{
                res.send({
                    success: false,
                    text: '해당 스타일이 없습니다'
                });
            }
        });
    }
});

router.post('/delete/:pid', (req, res, next) =>{
    if (typeof req.session.user !== 'undefined'){
        models.Post.findOne({
            where:{
                id : req.params.pid
            }
        }).then(function(post){
            if(post !== null){
                if(post.uid === req.session.user.id){
                    post.destroy().then(function(){
                        res.send({
                          success: true
                        });
                      });
                }else{
                    res.send({
                        success: false,
                        text: "권한이 없습니다"
                    });
                }
            }else{
                res.send({
                    success: false,
                    text: "해당하는 스타일이 없습니다"
                });
            }
        });
    }else{
        res.send({
            success: false,
            text: "로그인이 안되있습니다"
        });
    }
});
//좋아요 추가
router.post('/addlike', (req, res, next) =>{
    //input pid
    if (typeof req.session.user !== 'undefined'){
        req.body.uid = req.session.user.id;
        models.Post_like_relation.findOne({
            where:{
                pid: req.body.pid,
                uid: req.session.user.id
            }
        }).then(function(like){
            if(like === null){
                models.Post_like_relation.create(req.body).then(function(){
                    res.send({
                        success: true
                    });
                });
            }else{
                res.send({
                    success: false,
                    text: "이미 좋아요를 하였습니다"
                });
            }
            
        });
        
    }else{
        res.send({
            success: false,
            text: "로그인이 안되있습니다"
        });
    }
});
//좋아요 제거
router.post('/deletelike', (req, res, next) =>{
    //input pid
    if (typeof req.session.user !== 'undefined'){
        req.body.uid = req.session.user.id;
        models.Post_like_relation.findOne({
            where: {
                pid: req.body.pid,
                uid: req.session.user.id
            }
        }).then(function(like){
            if(like !== null){
                like.destroy().then(function(){
                    res.send({
                      success: true
                    });
                  });
            }else{
                res.send({
                    success: false,
                    text: '좋아요를 누르신적이 없을겁니다'
                });
            }
        });
    }else{
        res.send({
            success: false,
            text: "로그인이 안되있습니다"
        });
    }
});

module.exports = router;