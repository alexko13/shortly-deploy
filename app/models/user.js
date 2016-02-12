var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  }
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(guess, actual, callback) {
  bcrypt.compare(guess, actual, function(err, isMatch) {
    if(err) {
      console.log(err);
      return;
    } else {
      callback(null, isMatch);
    }
  });
}

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports = User;