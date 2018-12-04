var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('respond comment');
});
//댓글 등록
router.post('/add', function(req, res, next) {
    //contents, pid
    if (typeof req.session.user !== 'undefined'){
        req.body.uid = req.session.user.id;
        models.comment.create(req.body).then(function(){
            res.send({
                success: true
            });
        });
    }else{
        res.send({
            success: false,
            text: "로그인이 안되있습니다"
        });
    }
});
//댓글 삭제
router.post('/delete/:id', function(req, res, next) {
    //id
    if (typeof req.session.user !== 'undefined'){
        models.comment.findOne({
            where:{
                id: req.params.id
            }
        }).then(function(comment){
            if(comment !== null){
                if(comment.uid === req.session.user.id){
                    comment.destroy().then(function(){
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
                    text: "존재하지 않는 댓글입니다"
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
// 해당 옷의 댓글정보
router.get('/get/:pid', (req, res, next)=>{
    models.comment.findAll({
        where: {
            pid: req.params.pid
        },
        include:{
            model: models.User,
            attributes: ['nickname']
        }
    }).then(function(comments){
        if(typeof comments[0] !== 'undefined'){
            res.send(comments);
        }else{
            res.send({
                success: false,
                text: "댓글이 없습니다"
            });
        }
    });
});


module.exports = router;
