var mongoose = require("mongoose");

var bcrypt = require('bcryptjs'); //bcryptjs 

var Schema = mongoose.Schema;

var roomSchema = new Schema({
  "roomtitle": String,
  "price": Number,
  "description": String,
  "location": String,
  "roomphoto": String
});

module.exports = mongoose.model('Rooms', roomSchema);