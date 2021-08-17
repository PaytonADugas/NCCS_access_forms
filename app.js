var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var store = new MongoDBStore({
  uri: 'mongodb+srv://PaytonADugas:M5x1DR9TeUGRBbt5@nccs.tl9mm.mongodb.net/store?retryWrites=true&w=majority',
  collection: 'myStore'
});

// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');

const oneDay = 1000 * 60 * 60 * 24;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    cookie: { maxAge: oneDay },
    store: store,
    resave: false,
    saveUninitialized: false,
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
