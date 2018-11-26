var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');

var ejs = require('ejs');
var index = require('./routes/index');
var users = require('./routes/users');

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

app.use(multer({
  dest: './uploads/', // 업로드된 파일 임시경로
  //inMemory: true,
  limits: {
      fileSize: 1024 * 1024 * 50, // 업로드 용량 50메가 제한
      //        files: 1, // 파일, 필드, 파트도 1메가 제한
      //        fields: 1,
      //        parts: 1
  },
  onFileSizeLimit: function(file) {
      try {
          fs.unlinkSync(file.path);
      } catch (err) {}
      file.isFileSizeLimit = true;
      return file;
  }
}).single('image'));

// Configuration
// app.use(express.static(__dirname + '/public'));
// app.use(bodyParser());

//app.use(connect.json());
//app.use(connect.urlencoded());

//routes
app.use('/', index);
app.use('/users', users);

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
