var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost/worktile');

var UserSchema = new Schema({
    username: String,
    password: String,
    project: Array,
    team: Array
});

module.exports = mongoose.model("user", UserSchema);