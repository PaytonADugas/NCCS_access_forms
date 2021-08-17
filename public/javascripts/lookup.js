// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');
var sql = require('mysql');

var server = 'aggregatesqlserver.database.windows.net'
var database = 'AGGREGATEDEVDB'
var username = 'sqladmin'
var password = 'LoveYourNeighbor!'
var driver= '{ODBC Driver 17 for SQL Server}'

var con = mysql.createConnection({
  server: server,
  user: username,
  password: password,
  database: database
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM columID", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});


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
