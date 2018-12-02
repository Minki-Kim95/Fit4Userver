var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('respond follow');
});
//팔로우된 사람들 리스트
router.get('/followers/:uid', function(req, res, next) {
    models.User_relation.findAll({
        where:{
          id_two: req.params.uid
        }
      }).then(function(relation){
            res.send(relation);
      });
});

router.post('/isfollow', (req, res, next)=>{
    //id_two(uid)
    if (typeof req.session.user !== 'undefined'){
        models.User_relation.findOne({
          where:{
            id_one: req.session.user.id,
            id_two: req.body.id_two
          }
        }).then(function(relation){
            if(relation !== null){
                res.send({
                    isfollow: true
                });
            }else{
                res.send({
                    isfollow: false,
                    text: "로그인 되있는데 진짜 팔로우 안되있음"
                });
            }
        });
      }else{
          res.send({
              isfollow: false,
              text: "로그인이 안되있습니다"
          });
      }
});

router.post('/add', (req, res, next)=>{
    //id_two(uid)
    if (typeof req.session.user !== 'undefined'){
        req.body.id_one = req.session.user.id;
        models.User_relation.findOne({
          where:{
            id_one: req.session.user.id,
            id_two: req.body.id_two
          }
        }).then(function(relation){
            if(relation === null){
                models.User_relation.create(req.body).then(function(){
                    result = {
                        success: true
                    };
                    res.send(result);
                });
            }else{
                res.send({
                    success: false,
                    text: "이미 팔로우 되어있습니다"
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

router.post('/delete', (req, res, next)=>{
    //id_two(uid)
    if (typeof req.session.user !== 'undefined'){
        req.body.id_one = req.session.user.id;
        models.User_relation.findOne({
          where:{
            id_one: req.session.user.id,
            id_two: req.body.id_two
          }
        }).then(function(relation){
            if(relation !== null){
                relation.destroy().then(function(){
                    result = {
                        success: true
                    };
                    res.send(result);
                });
            }else{
                res.send({
                    success: false,
                    text: "이미 언팔로우 되있습니다"
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
