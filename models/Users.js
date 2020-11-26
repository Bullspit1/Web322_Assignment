var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//mongo connection
const password = encodeURIComponent("9TbtxsEYVY");
mongoose.connect(`mongodb+srv://Stephen:${password}@assignmentusers.jqq5a.mongodb.net/userlogins?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

//(debugging) -- checks if the database is connected
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', `mongodb+srv://Stephen:${password}@assignmentusers.jqq5a.mongodb.net/userlogins?retryWrites=true&w=majority`)
})
db.on('error', err => {
  console.error('connection error:', err)
})

var schema = new Schema({
    "firstname": String,
    "lastname": String,
    "email":  { type: String, unique: true },
    "password": String,
    "Admin": {
        "type" : Boolean,
        "default" : false
    }
});

module.exports = mongoose.model('Users', schema);