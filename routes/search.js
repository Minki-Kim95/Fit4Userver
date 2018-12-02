var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('respond search');
});

router.post('/post', (req, res, next)=>{
    //string
        models.Post.findAll({
        }).then(function(posts){
            var searcharray = posts;
            var searched = [];
            var word = req.body.string;
            var i = 0;
            console.log(searcharray);
            while (typeof searcharray[i] !== 'undefined'){ 
                console.log(searcharray[i].hashtag);
                var tempt = searcharray[i].hashtag;
                if(tempt.includes(word))
                    searched.push(searcharray[i]);
                i++
            }
            res.send(searched);
        });
});

router.post('/clothing', (req, res, next)=>{
    //string
        models.Clothing.findAll({
        }).then(function(clothings){
            var searcharray = clothings;
            var searched = [];
            var word = req.body.string; //검색어 word
            var i = 0;
            console.log(searcharray);
            while (typeof searcharray[i] !== 'undefined'){ 
                console.log(searcharray[i].hashtag);
                var tempt = searcharray[i].hashtag;
                if(tempt.includes(word))
                    searched.push(searcharray[i]); 
                i++
            
            } 
            res.send(searched);
        });
});


module.exports = router;