var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var sha256 = require('sha256');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');


router.get('/', function(req, res, next) {
    res.send('respond clothoption');
  });

router.post('/add', (req, res, next) => {
    if (req.body.topdown > 3){
        res.send({
            success: false,
            text: '유효하지 않는 형식입니다(topdown)'
        });
    }else{
        models.Clothoption.findOne({
            where: {
                oname: req.body.oname
            }
        }).then(function(option){
            console.log(option);
            if(option === null){
                models.Clothoption.create(req.body).then(function(){
                    result = {
                        success: true
                    };
                    res.send(result);
                });
            }
            else{
                result = {
                    success: false,
                    text: '이미 존재하는 옵션 입니다'
                }
                res.send(result);
            }
        });
    }
});
router.post('/delete', (req, res, next) => {
    models.Clothoption.findOne({
        where: {
            id: req.body.id
        }
    }).then(function(option){
        console.log(option);
        if(option !== null){
            option.destroy().then(function(){
                result = {
                    success: true
                };
                res.send(result);
            });
        }
        else{
            result = {
                success: false,
                text: '존재하지 않는 옵션 입니다'
            }
            res.send(result);
        }
    });
});
router.get('/getoptions', (req, res, next) => {
    models.Clothoption.findAll({
        attributes: ['id', 'oname', 'topdown']
    }).then(function(option){
        if (typeof option !== 'undefined')
            res.send(option);
        else{
            result = {
                success: false,
                text: '존재하지 않는 옵션 입니다'
            }
            res.send(result);
        }
    });
});

router.get('/getoptions/:topdown', (req, res, next) => {
    models.Clothoption.findAll({
        where: {
            topdown: req.params.topdown
        },
        attributes: ['id', 'oname']
    }).then(function(option){
        if (typeof option !== 'undefined')
            res.send(option);
        else{
            result = {
                success: false,
                text: '존재하지 않는 옵션 입니다'
            }
            res.send(result);
        }
    });
});

router.get('/getoption/:id', (req, res, next) => {
    models.Clothoption.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'oname']
    }).then(function(option){
        if(option !== null){
            res.send(option);
        }
        else{
            result = {
                success: false,
                text: '존재하지 않는 옵션 입니다'
            }
            res.send(result);
        }
    });
});

module.exports = router;