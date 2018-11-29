var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');

var ejs = require('ejs');

//login, logout, upload, loadimage
var index = require('./routes/index');
// register user
var register = require('./routes/register');
//clothing
var clothing = require('./routes/clothing');
//cloth option
var clothoption = require('./routes/clothoption');
//post(style)
var post = require('./routes/post.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public'))); // public 폴더 static 라우팅
app.use('/webdata', express.static(path.join(__dirname, 'webdata')));

app.use(session({
  secret: 'kmk',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3*60*60*1000 } // 세션 유지 3시간
}));

//routes
app.use('/', index);
app.use('/register', register);
app.use('/clothing', clothing);
app.use('/clothoption', clothoption);
app.use('/post', post);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
