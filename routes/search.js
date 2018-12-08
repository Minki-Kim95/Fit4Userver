var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('respond search');
});

router.post('/post', async function(req, res, next){
    //string
        var posts = await models.Post.findAll({
        });
        var searcharray = posts;
        var searched = [];
        var word = req.body.string;
        //찾기
        var i = 0;
        while (typeof searcharray[i] !== 'undefined'){ 
            var tempt = searcharray[i].hashtag;
            if(tempt.includes(word))
                searched.push(searcharray[i]);
            i++
        }
        //값넣기
        i = 0;
        while (typeof searched[i] !== 'undefined'){ 
            const likenum = await models.Post_like_relation.count({
                where: {
                    pid: searched[i].id
                }
            });
            searched[i].dataValues.like = likenum;
            if (typeof req.session.user !== 'undefined'){
                const likeis = await models.Post_like_relation.findOne({
                    where:{
                        uid: req.session.user.id,
                        pid: searched[i].id
                    }
                });
                if(likeis !== null){
                    searched[i].dataValues.islike = true;
                }else if(typeof req.session.user !== 'undefined'){
                    searched[i].dataValues.islike = false;
                }
            }else{
                searched[i].dataValues.islike = false;
            }
            const commentnum = await models.comment.count({
                where:{
                    pid: searched[i].id
                }
            });
            searched[i].dataValues.commentnum = commentnum;
            //키 몸무게
            const user = await models.User.findOne({
                where:{
                    id: searched[i].uid
                }
            });
            searched[i].dataValues.nickname = user.nickname;
            searched[i].dataValues.height = user.height;
            searched[i].dataValues.weight = user.weight;
            i++
        }
        res.send(searched);
});

router.post('/clothing', async function(req, res, next){
    //string
        var clothings = await models.Clothing.findAll({
        });
        var searcharray = clothings;
        var searched = [];
        var word = req.body.string; //검색어 word

        var i = 0;
        while (typeof searcharray[i] !== 'undefined'){ 
            var tempt = searcharray[i].hashtag;
            if(tempt.includes(word))
                searched.push(searcharray[i]); 
            i++
        } 
        i = 0;
        while (typeof searched[i] !== 'undefined'){ 
            const likenum = await models.Cloth_like_relation.count({
                where: {
                    cid: searched[i].id
                }
            });
            searched[i].dataValues.like = likenum;
            const user = await models.User.findOne({
                where: {
                    id: searched[i].uid
                }
            });
            searched[i].dataValues.nickname = user.nickname;
            if (typeof req.session.user !== 'undefined'){
                const likeis = await models.Cloth_like_relation.findOne({
                    where:{
                        uid: req.session.user.id,
                        cid: searched[i].id
                    }
                });
                if(likeis !== null){
                    searched[i].dataValues.islike = true;
                }else if(typeof req.session.user !== 'undefined'){
                    searched[i].dataValues.islike = false;
                }
            }else{
                searched[i].dataValues.islike = false;
            }
            i++
        } 

        res.send(searched);
});


module.exports = router;