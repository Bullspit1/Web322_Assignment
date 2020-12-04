var mongoose = require("mongoose");

var bcrypt = require('bcryptjs'); //bcryptjs 

var Schema = mongoose.Schema;

//mongo connection
const password = encodeURIComponent("9TbtxsEYVY");
mongoose.connect(`mongodb+srv://Stephen:${password}@assignmentusers.jqq5a.mongodb.net/assignment?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

//(debugging) -- checks if the database is connected
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', `mongodb+srv://Stephen:${password}@assignmentusers.jqq5a.mongodb.net/assignment?retryWrites=true&w=majority`)
})
db.on('error', err => {
  console.error('connection error:', err)
})

var roomSchema = new Schema({
  "roomtitle": String,
  "price": Number,
  "description": String,
  "location": String,
  "roomphoto": [String], //array of strings(room photo links)
  "ownername": String,
  "owneremail": String
});

module.exports = mongoose.model('Rooms', roomSchema);