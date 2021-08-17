var express = require('express');
var url = require('url');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');
var ObjectID = require('mongodb').ObjectID
var pdfForm = require('pdfform.js');
var Blob = require('node-fetch');


// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://PaytonADugas:M5x1DR9TeUGRBbt5@nccs.tl9mm.mongodb.net/student_forms?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Current date
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

today = year + "-" + month + "-" + day;

//Get models
// var models_path = __dirname + '../' + '/models'
// fs.readdirSync(models_path).forEach(function (file) {
//   if (~file.indexOf('.js')) require(models_path + '/' + file)
// })
require('../models/student.js');
const StudentModel = mongoose.model('student');
require('../models/user.js');
const UserModel = mongoose.model('user');

////////////////////////////////// Passport //////////////////////////////////

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
const GOOGLE_CLIENT_ID = '420648149659-dq7mkq3vh733m89otpldhqnqjn8jp43k.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'JIXVQVfIOTlMQcGOczfSnl6R';
//const GOOGLE_REDIRECT = 'https://nccs-form-automation.herokuapp.com/auth/google/callback';
const GOOGLE_REDIRECT = 'http://localhost:3000/auth/google/callback';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_REDIRECT
  },
  function(accessToken, refreshToken, profile, done) {
    UserModel.findOne({
      user_id: profile.id
    }, function(err, user){
      if(!user){
        var user = new UserModel({
          username: profile.displayName,
          user_id: profile.id,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          provider: 'google',
          google: profile._json
        })
        user.save(function(){
          if(err) console.log(err);
          return done(err, user);
        })
      }else{
        return done(err, user);
      }
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/index' }),
  function(req, res) {
    res.render('home', { user: req.user});
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

////////////////////////////////// Passport //////////////////////////////////

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/home', function(req, res, next) {
  res.render('home', { user: req.user || '' });
});

router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Form' });
});

router.get('/submitted', function(req, res, next){
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    if(req.user.user_id == '101324339836012249103')
      res.render('submitted', { student: result});
    else
      res.redirect('/');
  });
});

router.get('/student', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.render('student', { student: result[i], student_id: id});
    }
  });
});

router.post('/student', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.download('marguerite-729510__340.webp');
    }
  });
});

router.get('/student_edit', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.render('student_edit', { student: result[i], student_id: id});
    }
  });
});

router.post('/student_edit', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  updateData(id, req).then(() => {
    res.redirect(`/student?id=${id}`);
  });
});

async function updateData(id, req) {
  try {
    await db.collection('students').updateOne(
      {'_id': ObjectID(id)},
      { $set: {
        age: req.body.age,
        grade: req.body.grade,
        father_name: req.body.father_name,
        father_employment: req.body.father_employment,
        mother_name: req.body.mother_name,
        mother_employment: req.body.mother_employment,
        family_address: req.body.family_address,
        family_city: req.body.family_city,
        family_state: req.body.family_state,
        family_zip: req.body.family_zip,
        family_phone: req.body.family_phone,
        family_email: req.body.family_email,
        student_living_with: req.body.student_living_with,
        student_guardian: req.body.student_guardian,
        family_church: req.body.family_church,
        primary_teacher: req.body.primary_teacher,
        high_school_eduication: req.body.high_school_eduication,
        college_eduication: req.body.college_eduication,
        list_training: req.body.list_training,
        notes: req.body.notes,
        feesRecieved: req.body.feesRecieved,
        lettersSent: req.body.lettersSent,
        tdap: req.body.tdap,
        HSLDA_membership_id: req.body.HSLDA_membership_id,
        HSLDA_membership_expires: req.body.HSLDA_membership_expires
      }}
    );
  } catch(err){
    console.log(err);
  }

  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        sendEmail('u',result[i].first_name, result[i].last_name, id)
    }
  });

}

module.exports = router;
