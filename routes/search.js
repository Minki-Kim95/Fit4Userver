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
            //posts에 모든 post(style정보) 가져옴
            //posts는 array로 이루어져 있으며 값을 불러올 때는 posts[0].hashtag의 형식으로 불러온다.
            //이때 post[i].hashtag는 hashtag의 모든 정보를 불러와서 부르면 '#행복 #행벅 #세일' 이런식으로 불러온다.
            //여기서 해당 안되는 거는 삭제를 해주고 나머지를 출력해주면 됨
            //주의 사항: nodejs는 비동기 식이라서 코드가 순서대로 출력이 안되서 앞에서 칼럼을 삭제했다고 뒤에서 삭제된게 반영안됨
            var searcharray = posts;

            var word = req.body.string;
            var i = 0;
            console.log(searcharray);
            while (typeof searcharray[i] !== 'undefined'){  //searcharray가 끝날때까지 돌려줌
                //searcharray[i].hashtag에서 hashtag 정보 가지고 있음
                //검색어는 word임
                console.log(searcharray[i].hashtag);
                i++
            }
            res.send(searcharray);
        });
});

router.post('/clothing', (req, res, next)=>{
    //string
        models.Clothing.findAll({
        }).then(function(clothings){
            //posts에 모든 post(style정보) 가져옴
            //posts는 array로 이루어져 있으며 값을 불러올 때는 posts[0].hashtag의 형식으로 불러온다.
            //이때 post[i].hashtag는 hashtag의 모든 정보를 불러와서 부르면 '#행복 #행벅 #세일' 이런식으로 불러온다.
            //여기서 해당 안되는 거는 삭제를 해주고 나머지를 출력해주면 됨
            //주의 사항: nodejs는 비동기 식이라서 코드가 순서대로 출력이 안되서 앞에서 칼럼을 삭제했다고 뒤에서 삭제된게 반영안됨
            var searcharray = clothings;

            var word = req.body.string;
            var i = 0;
            console.log(searcharray);
            while (typeof searcharray[i] !== 'undefined'){  //searcharray가 끝날때까지 돌려줌
                //searcharray[i].hashtag에서 hashtag 정보 가지고 있음
                //검색어는 word임
                console.log(searcharray[i].hashtag);
                i++
            }
            res.send(searcharray);
        });
});


module.exports = router;
