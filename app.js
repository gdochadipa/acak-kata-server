var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var categoryRouter = require('./app/category/router');
const authRouter = require('./app/auth/router');
const userRouter = require('./app/user/router');
const roomRouter = require('./app/room_match/router');
const languageRouter = require('./app/languages/router');
const levelRouter = require('./app/level/router');
const adminUserRouter = require('./app/user/admin_router');
const jobs = require('./jobs/index');
const { url } = require('inspector');

var app = express();
const URL = `/api/v1`;

// TZ = "Asia/Makassar";
// console.log(new Date().toString());

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adminlte', express.static(path.join(__dirname,'/node_modules/admin-lte/')));

app.use('/', categoryRouter);
app.use('/admin', adminUserRouter);


//api 

app.use(`${URL}/auth`,authRouter);
app.use(`${URL}/user`, userRouter);
app.use(`${URL}/room`, roomRouter);
app.use(`${URL}/language`, languageRouter);
app.use(`${URL}/level`,levelRouter);

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
