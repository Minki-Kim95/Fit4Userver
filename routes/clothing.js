var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var router = express.Router();
//multer
var multer = require('multer');
var storage = multer.diskStorage({
  // 서버에 저장할 폴더
  destination: function (req, file, cb) {
    cb(null, "uploads/clothing");
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

router.post('/', upload.fields([{name : 'basicimage'},{name : 'image1'},{name : 'image2'},{name : 'image3'}] ), (req, res, next) => {
    if (req.body.cname.length < 1 || req.body.cname.length > 20){
        res.send({
            success: false,
            text: '옷 이름은 20자까지 가능합니다'
        });
    }
    else if (req.body.hashtag.length < 1 || req.body.hashtag.length > 255){
        res.send({
            success: false,
            text: '해쉬태그는 255자까지 가능합니다'
        });
    }
    else if (req.body.season === null){
        res.send({
            success: false,
            text: '계절 요소는 필수입력사항입니다'
        });
    }
    else{
        models.Clothing.findOne({
            where: {
                cname: req.body.cname
            }
        }).then(function(clothing){
            if (clothing === null) {
                req.body.views = 0;
                if (typeof req.session.user === 'undefined'){
                    res.send({
                        success: false,
                        text: "로그인이 안되있습니다"
                    });
                }else{
                    req.body.uid = req.session.user.id;
                    if (typeof req.files.basicimage !== 'undefined')
                        req.body.basicimage = 'clothing/' + req.files.basicimage[0].filename;
                    if (typeof req.files.image1 !== 'undefined')
                        req.body.photo1 = 'clothing/' + req.files.image1[0].filename;
                    if (typeof req.files.image2 !== 'undefined')
                        req.body.photo2 = 'clothing/' + req.files.image2[0].filename;
                    if (typeof req.files.image3 !== 'undefined')
                        req.body.photo3 = 'clothing/' + req.files.image3[0].filename;
                    models.Clothing.create(req.body).then(function(){
                        models.Clothing.findOne({
                            where:{
                                cname : req.body.cname
                            }
                        }).then(function(clothinfo){
                            result = {
                                success: true,
                                cid : clothinfo.id
                            };
                            res.send(result);
                        });
                        
                    });
                }
            } else {
                result = {
                    success: false,
                    text: '이미 존재하는 옷 이름 입니다'
                };
                res.send(result);
            }
        }); 
    }
});
//해당 옷의 상세 정보
router.get('/specific/:cid', (req, res, next) =>{
    models.Clothing.findOne({
        where: {
            id: req.params.cid
        }
     }).then(function(clothing){
        if (clothing !== null) {
            models.Clothing.update(
                {views: clothing.views + 1},
                {where: {
                    id: req.params.cid
                }}
            ).then(function(){
                models.Cloth_like_relation.findAll({
                    where:{
                        cid: req.params.cid
                    }
                }).then(function(likenum){
                    var i = 0;
                    while(typeof likenum[i] !== 'undefined')
                        i++;
                    var islike;
                    if(typeof req.session.user !== 'undefined'){
                        models.Cloth_like_relation.findOne({
                            where:{
                                cid: req.params.cid,
                                uid: req.session.user.id
                            }
                        }).then(function(like){
                            if(like !== null)
                                islike = true;
                            else
                                islike = false;
                            res.send({
                                id: clothing.id,
                                cname: clothing.cname,
                                views: clothing.views,
                                hashtag: clothing.hashtag,
                                cost: clothing.cost,
                                link: clothing.link,
                                season: clothing.season,
                                mallname: clothing.mallname,
                                gender: clothing.gender,
                                basicimage: clothing.basicimage,
                                photo1: clothing.photo1,
                                photo2: clothing.photo2,
                                photo3: clothing.photo3,
                                createdAt: clothing.createdAt,
                                uid: clothing.uid,
                                oid: clothing.oid,
                                like: i,
                                islike: islike
                            });
                        });
                    }else{
                        res.send({
                            id: clothing.id,
                            cname: clothing.cname,
                            views: clothing.views,
                            hashtag: clothing.hashtag,
                            cost: clothing.cost,
                            link: clothing.link,
                            season: clothing.season,
                            mallname: clothing.mallname,
                            gender: clothing.gender,
                            basicimage: clothing.basicimage,
                            photo1: clothing.photo1,
                            photo2: clothing.photo2,
                            photo3: clothing.photo3,
                            createdAt: clothing.createdAt,
                            uid: clothing.uid,
                            oid: clothing.oid,
                            like: i,
                            islike: false
                        });
                    }
                });
            });
        } else {
            result = {
                success: false,
                text: '존재하지 않는 옷입니다'
            };
            res.send(result);
        }
    }); 
});
router.post('/modify/:cid',upload.fields([{name : 'basicimage'},{name : 'image1'},{name : 'image2'},{name : 'image3'}] ), (req, res, next)=>{
    console.log(req.files);
    if (req.body.cname.length < 1 || req.body.cname.length > 10){
        res.send({
            success: false,
            text: '옷 이름은 10자까지 가능합니다'
        });
    }
    else if (req.body.hashtag.length < 1 || req.body.hashtag.length > 255){
        res.send({
            success: false,
            text: '해쉬태그는 255자까지 가능합니다'
        });
    }
    else if (req.body.season === null){
        res.send({
            success: false,
            text: '계절 요소는 필수입력사항입니다'
        });
    }
    else{
        models.Clothing.findOne({
            where: {
                id: req.params.cid
            }
        }).then(function(clothing){
            if (clothing !== null) {
                if (typeof req.session.user === 'undefined' && req.session.user.id !== clothing.uid){
                    res.send({
                        success: false,
                        text: "권한이 없거나 로그인이 안되있습니다"
                    });
                }else{
                    if (typeof req.files.basicimage !== 'undefined')
                        req.body.basicimage = 'clothing/' + req.files.basicimage[0].filename;
                    if (typeof req.files.image1 !== 'undefined')
                        req.body.photo1 = 'clothing/' + req.files.image1[0].filename;
                    if (typeof req.files.image2 !== 'undefined')
                        req.body.photo2 = 'clothing/' + req.files.image2[0].filename;
                    if (typeof req.files.image3 !== 'undefined')
                        req.body.photo3 = 'clothing/' + req.files.image3[0].filename;
                    clothing.updateAttributes(req.body).then(function(){
                        models.Clothing.findOne({
                            where:{
                                id : req.params.cid
                            }
                        }).then(function(clothinfo){
                            result = {
                                success: true,
                                cid : clothinfo.id
                            };
                            res.send(result);
                        });
                        
                    });
                }
            } else {
                result = {
                    success: false,
                    text: '옷이 존재하지 않습니다'
                };
                res.send(result);
            }
        }); 
    }
});

router.post('/delete/:cid', (req, res, next) =>{
    if (typeof req.session.user !== 'undefined'){
        models.Clothing.findOne({
            where:{
                id : req.params.cid
            }
        }).then(function(clothing){
            if(clothing !== null){
                if(clothing.uid === req.session.user.id){
                    clothing.destroy().then(function(){
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
                    text: "해당하는 옷이 없습니다"
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
    //input cid
    if (typeof req.session.user !== 'undefined'){
        req.body.uid = req.session.user.id;
        models.Cloth_like_relation.findOne({
            where:{
                cid: req.body.cid,
                uid: req.session.user.id
            }
        }).then(function(like){
            if(like === null){
                models.Cloth_like_relation.create(req.body).then(function(){
                    res.send({
                        success: true
                    });
                });
            }else{
                res.send({
                    success: false,
                    text: "이미 좋아요를 눌렀습니다"
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
    //input cid
    if (typeof req.session.user !== 'undefined'){
        req.body.uid = req.session.user.id;
        models.Cloth_like_relation.findOne({
            where: {
                cid: req.body.cid
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
                    success: false
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
//좋아요 누른사람 리스트
router.get('/likelist/:cid', async function(req, res, next) {
    var likelist = await models.Cloth_like_relation.findAll({
        where: {
            cid: req.params.cid
        },
        include:{
            model: models.User,
            attributes: ['uname', 'nickname', 'photo']
        }
    });
    res.send(likelist);
  });
/*사이즈 정보 처리*/
//사이즈 추가
router.post('/addsize', (req, res, next) =>{
    //input: cid, sizeinfo
    console.log(req.body);
    if (typeof req.body.cid !== 'undefined'){
        models.Clothing.findOne({
            where:{
                id : req.body.cid
            }
        }).then(function(clothing){
            if(clothing !== null){
                models.Size.create(req.body).then(function(){
                    result = {
                        success: true
                    };
                    res.send(result);
                });
            }else{
                result = {
                    success: false,
                    text: '옷정보가 없습니다'
                };
                res.send(result);
            }
        })
    }else{
        result = {
            success: false,
            text: '옷정보를 입력해 주십시오'
        };
        res.send(result);
    }
});
//사이즈 제거
router.post('/deletesize', (req, res, next) =>{
    //input: id
    models.Size.findOne({
        where:{
            id : req.body.id
        }
    }).then(function(size){
        if(size !== null) {
            size.destroy().then(function(){
              res.send({
                success: true
              });
            });
          } else{
            res.send({
              success: false
            });
          }
    });
});
//해당 옷의 사이즈 출력
router.get('/sizes/:cid', (req, res, next) =>{
    models.Size.findAll({
        where: {
            cid: req.params.cid
        }
    }).then(function(size){
        if(typeof size !== 'undefined') {
            res.send(size);
        } else{
            res.send({
              success: false,
              text: '해당옷의 사이즈 정보가 존재하지 않습니다'
            });
        }
    });
});

//사이즈 id 의 사이즈 정보 출력
router.get('/size/:sid', (req, res, next) =>{
    models.Size.findOne({
        where: {
            id: req.params.sid
        }
    }).then(function(size){
        if(size !== null) {
            res.send(size);
        } else{
            res.send({
              success: false,
              text: '해당 사이즈 정보가 존재하지 않습니다'
            });
        }
    });
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
//모든 clothing을 일정 규칙으로 정렬하여 보내기
router.get('/all/:page/:optionnum/:gender/:season', async function(req, res, next){
    // -> page
    // sortoption => optionnum
    // 1: Last->normalcase, 2: Most Liked, 3: Most Views

    // filter: 
    // gender (0: 공용 1: man, 2: woman)
    // season (0: 공용 1:봄,가을 2:여름, 3:겨울)
    // 5개씩 보내기
    // page 별로 1~5, 6~10, 11~15으로 나누기
    var pagenum = Number(req.params.page);
    if (pagenum <= 0){
        res.send({
            success: false,
            text: '페이지 넘버를 똑바로 입력하십시오'
          });
    }
    var sortstring = 'id desc';
    if(!(req.params.optionnum === '0' ||req.params.optionnum === '1' ||req.params.optionnum === '2' || req.params.optionnum === '3')){
        res.send({
            success: false,
            text: 'optionnumber를 똑바로 줘라'
          });
    }
    const num = await models.Clothing.count({
        where:{
            gender: req.params.gender,
            season: req.params.season
        }
     });

    let clothing = await models.Clothing.findAll({
        where:{
            gender: req.params.gender,
            season: req.params.season
        },
        attributes: ['id', 'cname', 'views', 'hashtag', 'cost',
         'link', 'season', 'mallname', 'gender', 'basicimage',
          'photo1', 'photo2', 'photo3', 'createdAt', 'uid', 'oid']
     });
     var i = 0
     while(typeof clothing[i] !== 'undefined'){
        //좋아요 수 찾기
        const likenum = await models.Cloth_like_relation.count({
            where: {
                cid: clothing[i].id
            }
        });
        if (clothing[i].id === 9)
            console.log(likenum);
        clothing[i].dataValues.like = likenum;
        if (typeof req.session.user !== 'undefined'){
            const likeis = await models.Cloth_like_relation.findOne({
                where:{
                    uid: req.session.user.id,
                    cid: clothing[i].id
                }
            });
            if(likeis !== null){
                clothing[i].dataValues.islike = true;
            }else if(typeof req.session.user !== 'undefined'){
                clothing[i].dataValues.islike = false;
            }
        }else{
            clothing[i].dataValues.islike = false;
        }
        clothing[i].dataValues.numclothing = num;
            i++;
    }
    //좋아요순 정렬
    if (req.params.optionnum === '2')
        await clothing.sort(comparelike);
    //조회수순 정렬
    if (req.params.optionnum === '3')
        await clothing.sort(compareviews);

    let clothingset = [];
    for (i = 5*pagenum - 5; i < 5*pagenum; i++){
        if(clothin[i] !== null)
            clothingset.push(clothing[i]);
    }
    res.send(clothingset);
});
//유저가 들고있는 clothing list
router.get('/user/:page/:uid', async function(req, res, next){
    // -> page
    // 5개씩 보내기
    // page 별로 1~5, 6~10, 11~15으로 나누기
    var pagenum = Number(req.params.page);
    if (pagenum <= 0){
        res.send({
            success: false,
            text: '페이지 넘버를 똑바로 입력하십시오'
          });
    }
    const num = await models.Clothing.count({
        where:{
            uid: req.params.uid
        }
     });
    let clothing = await models.Clothing.findAll({
        where:{
            uid: req.params.uid
        },
        attributes: ['id', 'cname', 'views', 'hashtag', 'cost',
         'link', 'season', 'mallname', 'gender', 'basicimage',
          'photo1', 'photo2', 'photo3', 'createdAt', 'uid', 'oid'],
        offset: 5*pagenum - 5,
        limit: 5*pagenum
     });
     var i = 0
     while(typeof clothing[i] !== 'undefined'){
        //좋아요 수 찾기
        const likenum = await models.Cloth_like_relation.count({
            where: {
                cid: clothing[i].id
            }
        });
        clothing[i].dataValues.like = likenum;
        if (typeof req.session.user !== 'undefined'){
            const likeis = await models.Cloth_like_relation.findOne({
                where:{
                    uid: req.session.user.id,
                    cid: clothing[i].id
                }
            });
            if(likeis !== null){
                clothing[i].dataValues.islike = true;
            }else if(typeof req.session.user !== 'undefined'){
                clothing[i].dataValues.islike = false;
            }
        }else{
            clothing[i].dataValues.islike = false;
        }
        clothing[i].dataValues.numclothing = num;
        i++;
    }

    res.send(clothing);
});



module.exports = router;