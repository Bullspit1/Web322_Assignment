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

var userSchema = new Schema({
    "firstname": String,
    "lastname": String,
    "email":  { 
      "type": String, 
      "unique": true 
    },
    "password": String,
    "dateOfBirth": Date,
    "admin": {
        "type" : Boolean,
        "default" : false
    }
});



userSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

//password verification function 
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = mongoose.model('Users', userSchema);