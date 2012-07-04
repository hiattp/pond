var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
  createdAt : { type: Date, default: Date.now },
  facebookId : String,
  fullName : String,
  firstName : String,
  lastName : String,
  facebookLink : String,
  facebookUsername : String,
  gender : String,
  email : String,
  timezone : Number,
  locale : String,
  verified : Boolean,
  facebookUpdatedTime : Date
});

UserSchema.statics.findOrCreateUser = function findOrCreateUser(u, callback){
  User.findOne({facebookId : u.id}, function(err,doc){
    if(err) callback(err);
    if(doc) callback(null,doc);
    var newUser = new User({
      facebookId : u.id,
      fullName : u.name,
      firstName : u.first_name,
      lastName : u.last_name,
      facebookLink : u.link,
      facebookUsername : u.username,
      gender : u.gender,
      email : u.email,
      timezone : u.timezone,
      locale : u.locale,
      verified : u.verified,
      facebookUpdatedTime : u.updated_time
    });
    newUser.save(function(err,savedUser){
      if(err) callback(err);
      callback(null,savedUser);
    });
  });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;