var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    team: Array
});

module.exports = mongoose.model("user", UserSchema);