var mongoose = require("mongoose");
var UserSchema = mongoose.Schema({
	username: String,
	password: String
});

UserSchema.statics.findByName = function(name,cb){
	return this.find({name:new RegExp(name,'i'),cb});
}

module.exports = UserSchema;