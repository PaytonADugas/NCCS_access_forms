const mongoose = require('mongoose');


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserModelSchema = new Schema({
  username: String,
  provider: String,
  first_name: String,
  last_name: String,
  user_id: String,
  dateAdded: {type: Date, default: Date.now}
});


// Export User Model
module.export = mongoose.model('user', UserModelSchema );
