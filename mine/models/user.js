var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost/worktile');

var UserSchema = new Schema({
    username: String,
    password: String
});
 
UserSchema.statics.findByName = function(name,cb){
	this.find({name:new RegExp(name,'i'),cb});
}

module.exports = mongoose.model("user", UserSchema);