var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var sha256 = require('sha256');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');

/* wishlist 정보 불러오기 */
router.get('/', function(req, res, next) {
    if (typeof req.session.user !== 'undefined'){
        models.Wishlist.findAll({
            where:{
                uid: req.session.user.id
            }
        }).then(function(wishlist){
            res.send(wishlist);
        });
    }else{
        res.send({
            success: false,
            text: "로그인이 안되있습니다"
        });
    }
});
//wishlist 입력
router.post('/', (req, res, next)=>{
    if (typeof req.session.user !== 'undefined'){
        models.Wishlist.findAll({
            where:{
                uid: req.session.user.id
            }
        }).then(function(wishlistnum){
            let i = 0;
            while (typeof wishlistnum[i] !== 'undefined')
                i++;
            if (i < 5){
                req.body.uid = req.session.user.id;
                models.Wishlist.create(req.body).then(function(){
                    models.Wishlist.findOne({
                        where: req.body
                    }).then(function(wishlist){
                        res.send({
                            success: true,
                            wid : wishlist.id
                        });
                    });
                });
            }else{
                res.send({
                    success: false,
                    text: "위시리스트가 5개를 초과했습니다"
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
//wishlist 수정
router.post('/modify/:wid',(req, res, next)=>{
    if (typeof req.session.user !== 'undefined'){
        models.Wishlist.findOne({
            where:{
                id : req.params.wid
            }
        }).then(function(wishlist){
            if (wishlist !== null){
                if( wishlist.uid === req.session.user.id){
                    req.body.uid = req.session.user.id;
                    wishlist.updateAttributes(req.body).then(function(){
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
                    text: "해당 위시리스트 정보가 없습니다"
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
//wishlist 제거
router.post('/delete/:wid',(req, res, next)=>{
    if (typeof req.session.user !== 'undefined'){
        models.Wishlist.findOne({
            where:{
                id : req.params.wid
            }
        }).then(function(wishlist){
            if (wishlist !== null){
                if( wishlist.uid === req.session.user.id){
                    wishlist.destroy().then(function(){
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
                    text: "해당 위시리스트 정보가 없습니다"
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
