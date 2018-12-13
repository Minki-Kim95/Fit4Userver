var express = require('express');
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
router.post('/', upload.fields([{name : 'clothingimage'},{name : 'avatarimage'}] ), (req, res, next) => {
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
            if (typeof req.files === 'undefined'){
                res.send({
                    success: false,
                    text: '이미지는 필수입니다'
                });
            }else{
                req.body.clothingimage = 'post/' + req.files.clothingimage[0].filename;
                req.body.avatarimage = 'post/' + req.files.avatarimage[0].filename;
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
router.get('/specific/:pid', async function(req, res, next){
    const numcomment = await models.comment.count({
        where:{
            pid: req.params.pid
        }
    });
    let post = await models.Post.findOne({
        where: {
            id: req.params.pid
        }
     });
    if (post !== null) {
        await models.Post.update(
            {views: post.views + 1},
            {where: {
                id: req.params.pid
            }}
        );
        const likenum = await models.Post_like_relation.count({
            where:{
                pid: req.params.pid
            }
        });
        post.dataValues.like = likenum;
        if(post.top_outer !==null){
            const to = await models.Clothing.findOne({
                where:{
                    id: post.top_outer
                }
            });
            if (to !== null){
                post.dataValues.top_outer_name = to.cname;
                post.dataValues.top_outer_mall = to.mallname;
            }
        }
        if(post.top_1 !==null){
            const t1 = await models.Clothing.findOne({
                where:{
                    id: post.top_1
                }
            });
            if (t1 !==null){
                post.dataValues.top_1_name = t1.cname;
                post.dataValues.top_1_mall = t1.mallname;
            }

        }
        if(post.top_2 !==null){
            const t2 = await models.Clothing.findOne({
                where:{
                    id: post.top_2
                }
            });
            if (t2 !== null){
                post.dataValues.top_2_name = t2.cname;
                post.dataValues.top_2_mall = t2.mallname;
            }

        }
        if(post.down !==null){
            const dw = await models.Clothing.findOne({
                where:{
                    id: post.down
                }
            });
            if (dw !== null){
                post.dataValues.down_name = dw.cname;
                post.dataValues.down_mall = dw.mallname;
            }

        }
        const user = await models.User.findOne({
            where:{
                id: post.uid
            }
        });
        post.dataValues.nickname = user.nickname;
        post.dataValues.height = user.height;
        post.dataValues.weight = user.weight;
        if(typeof req.session.user !== 'undefined'){
            const like = await models.Post_like_relation.findOne({
                where:{
                    pid: req.params.pid,
                    uid: req.session.user.id
                }
            });
            if(like !== null)
                islike = true;
            else
                islike = false;
            post.dataValues.islike = islike;
            post.dataValues.numcomment = numcomment;
            res.send(post);
        }else{
            islike = false;
            post.dataValues.islike = islike;
            post.dataValues.numcomment = numcomment;
            res.send(post);
        }
    } else {
        result = {
            success: false,
            text: '존재하지 않는 스타일 정보입니다'
        };
        res.send(result);
    }
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
//좋아요 리스트 출력
router.get('/likelist/:pid', async function(req, res, next) {
    var likelist = await models.Post_like_relation.findAll({
        where: {
            pid: req.params.pid
        },
        include:{
            model: models.User,
            attributes: ['uname', 'nickname', 'photo']
        }
    });
    res.send(likelist);
  });
function comparelike(a, b){
    if (a.dataValues.like < b.dataValues.like)
        return 1;
    else if(a.dataValues.like > b.dataValues.like)
        return -1;
    else
        return 0;
}
function compareviews(a, b){
    if (a.dataValues.views < b.dataValues.views)
        return 1;
    else if(a.dataValues.views > b.dataValues.views)
        return -1;
    else
        return 0;
}

//모든 post 정보 줌(page별)
router.get('/all/:page/:optionnum', async function(req, res, next){
    // -> page
    // sortoption => optionnum
    // 1: Last->normalcase, 2: Most Liked, 3: Most Views

    // 5개씩 보내기
    // page 별로 1~5, 6~10, 11~15으로 나누기
    var pagenum = Number(req.params.page);
    if (pagenum <= 0){
        res.send({
            success: false,
            text: '페이지 넘버를 똑바로 입력하십시오'
          });
    }
    if(!(req.params.optionnum === '0' ||req.params.optionnum === '1' ||req.params.optionnum === '2' || req.params.optionnum === '3')){
        res.send({
            success: false,
            text: 'optionnumber를 똑바로 줘라'
          });
    }
    const num = await models.Post.count({
     });

    let post = await models.Post.findAll({
     });
     var i = 0
     while(typeof post[i] !== 'undefined'){
        //좋아요 수 찾기
        const likenum = await models.Post_like_relation.count({
            where: {
                pid: post[i].id
            }
        });
        post[i].dataValues.like = likenum;
        if (typeof req.session.user !== 'undefined'){
            const likeis = await models.Post_like_relation.findOne({
                where:{
                    uid: req.session.user.id,
                    pid: post[i].id
                }
            });
            if(likeis !== null){
                post[i].dataValues.islike = true;
            }else if(typeof req.session.user !== 'undefined'){
                post[i].dataValues.islike = false;
            }
        }else{
            post[i].dataValues.islike = false;
        }
        post[i].dataValues.numpost = num;
        const commentnum = await models.comment.count({
            where:{
                pid: post[i].id
            }
        });
        post[i].dataValues.commentnum = commentnum;
        //키 몸무게
        const user = await models.User.findOne({
            where:{
                id: post[i].uid
            }
        });
        post[i].dataValues.nickname = user.nickname;
        post[i].dataValues.height = user.height;
        post[i].dataValues.weight = user.weight;
        i++;
    }
    //최신순 조회
    if (req.params.optionnum === '0' || req.params.optionnum === '1')
        await post.reverse();
    //좋아요순 정렬
    if (req.params.optionnum === '2')
        await post.sort(comparelike);
    //조회수순 정렬
    if (req.params.optionnum === '3')
        await post.sort(compareviews);

    let postgset = [];
    for (i = 5*pagenum - 5; i < 5*pagenum; i++){
        if(post[i] !== null)
            postgset.push(post[i]);
    }
        
    
    res.send(postgset);
});
//모든 post 정보 줌(한번에)
router.get('/alllist/:optionnum', async function(req, res, next){
    // sortoption => optionnum
    // 1: Last->normalcase, 2: Most Liked, 3: Most Views

    // 5개씩 보내기
    // page 별로 1~5, 6~10, 11~15으로 나누기
    if(!(req.params.optionnum === '0' ||req.params.optionnum === '1' ||req.params.optionnum === '2' || req.params.optionnum === '3')){
        res.send({
            success: false,
            text: 'optionnumber를 똑바로 줘라'
          });
    }
    const num = await models.Post.count({
     });

    let post = await models.Post.findAll({
     });
     var i = 0
     while(typeof post[i] !== 'undefined'){
        //좋아요 수 찾기
        const likenum = await models.Post_like_relation.count({
            where: {
                pid: post[i].id
            }
        });
        post[i].dataValues.like = likenum;
        if (typeof req.session.user !== 'undefined'){
            const likeis = await models.Post_like_relation.findOne({
                where:{
                    uid: req.session.user.id,
                    pid: post[i].id
                }
            });
            if(likeis !== null){
                post[i].dataValues.islike = true;
            }else if(typeof req.session.user !== 'undefined'){
                post[i].dataValues.islike = false;
            }
        }else{
            post[i].dataValues.islike = false;
        }
        post[i].dataValues.numpost = num;
        const commentnum = await models.comment.count({
            where:{
                pid: post[i].id
            }
        });
        post[i].dataValues.commentnum = commentnum;
        //키 몸무게
        const user = await models.User.findOne({
            where:{
                id: post[i].uid
            }
        });
        post[i].dataValues.nickname = user.nickname;
        post[i].dataValues.height = user.height;
        post[i].dataValues.weight = user.weight;
        i++;
    }
    //최신순 조회
    if (req.params.optionnum === '0' || req.params.optionnum === '1')
        await post.reverse();
    //좋아요순 정렬
    if (req.params.optionnum === '2')
        await post.sort(comparelike);
    //조회수순 정렬
    if (req.params.optionnum === '3')
        await post.sort(compareviews);

    res.send(post);
});

function comparepoint(a, b){
    if (a.point < b.point)
        return 1;
    else if(a.point > b.point)
        return -1;
    else
        return 0;
}
// 로그인한 유저와 체형 비슷한지확인하는 추천 알고리즘
router.get('/recomendation', async function(req, res, next){

    
    // 평가 항목들 점수 메기기 
    // 키: -+5 안이면 50 5칸씩 늘어날수록 10점 감점 (0이 최소)
    // 몸무게 : -+5 안이면 50 5칸씩 늘어날수록 10점 감점 (0이 최소)
    // 좋아요수: 그 수 * 3 
    // 조회수: 그 수만큼더하기
    // 팔로우 여부: 50
    // 날짜: 하루마다 -10
    // 자기 자신꺼 : 안줌
    const today = new Date();
    const today_Date = today.getDate();
    if (typeof req.session.user !== 'undefined'){
        const standard = await models.User.findOne({
            where:{
                id: req.session.user.id
            }
        });
        const posts = await models.Post.findAll({

        });

        let i = 0;
        let postlist = [];
        while(typeof posts[i] !== 'undefined'){
            //자기가 올린 post 제거
            if (posts[i].dataValues.uid === standard.id){
                i++;
                continue;
            }
            //좋아요 수 찾기
            const likenum = await models.Post_like_relation.count({
                where: {
                    pid: posts[i].id
                }
            });
            posts[i].dataValues.like = likenum;
            //좋아요 여부
            const likeis = await models.Post_like_relation.findOne({
                where:{
                    uid: req.session.user.id,
                    pid: posts[i].id
                }
            });
            if(likeis !== null)
                posts[i].dataValues.islike = true;
            else 
                posts[i].dataValues.islike = false;
            //댓글갯수
            const commentnum = await models.comment.count({
                where:{
                    pid: posts[i].id
                }
            });
            posts[i].dataValues.commentnum = commentnum;
            //해당 post를 올린 유저의 id
            const postuser = await models.User.findOne({
                where:{
                    id: posts[i].uid
                }
            });
            //키 몸무게
            posts[i].dataValues.nickname = postuser.nickname;
            posts[i].dataValues.height = postuser.height;
            posts[i].dataValues.weight = postuser.weight;
            
            let point = 0;
            let heightpoint = 0;
            let weightpoint = 0;
            // 키: -+5 안이면 50 5칸씩 늘어날수록 10점 감점 (0이 최소)
            // 몸무게 : -+5 안이면 50 5칸씩 늘어날수록 10점 감점 (0이 최소)
            heightInterval = Math.abs(postuser.height - standard.height);
            weightInterval = Math.abs(postuser.weight - standard.weight);
            heightpoint = 50 - 10 * parseInt(heightInterval / 5);
            weightpoint = 50 - 10 * parseInt(weightInterval / 5);
            if (heightpoint < 0)
                heightpoint = 0;
            if (weightpoint < 0)
                weightpoint = 0;
            point = heightpoint + weightpoint;
            // 좋아요수: 그 수 * 3 
            point = point + 3 * likenum;
            // 조회수: 그 수만큼더하기
            point = point + posts[i].views;
            // 팔로우 여부: 50
            const follow = await models.User_relation.findOne({
                where:{
                    id_one: req.session.user.id,
                    id_two: postuser.id
                }
            });
            if (follow !== null){
                point = point + 50;
                posts[i].dataValues.isfollow = true;
            }else
                posts[i].dataValues.isfollow = false;
            // 날짜: 하루마다 -10
            const dateInterval = today_Date - posts[i].createdAt.getDate();
            point = point - 10 * dateInterval;
            
            posts[i].dataValues.point = point;
            await postlist.push(posts[i].dataValues);
            i++;
        }
        //점수 기준으로 sorting
        await postlist.sort(comparepoint);
        res.send(postlist);
        
    }else{
        res.send({
            success: false,
            text: '로그인을 하시요'
          });
    }
});
//유저가 들고있는 post list
router.get('/user/:uid', async function(req, res, next){
    const num = await models.Post.count({
        where:{
            uid: req.params.uid
        }
     });

    let post = await models.Post.findAll({
        where:{
            uid: req.params.uid
        }
     });
     var i = 0
     while(typeof post[i] !== 'undefined'){
        //좋아요 수 찾기
        const likenum = await models.Post_like_relation.count({
            where: {
                pid: post[i].id
            }
        });
        post[i].dataValues.like = likenum;
        if (typeof req.session.user !== 'undefined'){
            const likeis = await models.Post_like_relation.findOne({
                where:{
                    uid: req.session.user.id,
                    pid: post[i].id
                }
            });
            if(likeis !== null){
                post[i].dataValues.islike = true;
            }else if(typeof req.session.user !== 'undefined'){
                post[i].dataValues.islike = false;
            }
        }else{
            post[i].dataValues.islike = false;
        }
        post[i].dataValues.numpost = num;
        const commentnum = await models.comment.count({
            where:{
                pid: post[i].id
            }
        });
        post[i].dataValues.commentnum = commentnum;
        i++;
    }
    //최신순 조회
    await post.reverse();
    res.send(post);
});


module.exports = router;
