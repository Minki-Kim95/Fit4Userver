var express = require('express');
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var models = require('../models');
var sha256 = require('sha256');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express' });
});

router.get('/index', function(req, res) {
  res.redirect('/');
});
//login
router.post('/login', function(req, res, next) {
  models.User.findOne({
    where: {
      userid: req.body.userid,
      pw: sha256(req.body.pw)
    }
  }).then(function(user){
    if(user !== null) {
      req.session.user = user;
      req.session.user.id = user.id;
      delete req.body.password;
      res.send({
        result: true
      });
    } else{
      res.send({
        result: false
      });
    }
  });
});
router.get('/logout', function(req, res, next) {
  req.session.user = {};
  delete req.session.user;
  if(req.session.user == null){
    res.send({
      result: true,
      msg: 'logout'
    });
  } else{
    res.send({
      result: false,
      msg: 'logout fail'
    });
  }
  
});
module.exports = router;
