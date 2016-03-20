var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
    teamname: String,
    teammember: Array,
    teamdesc: String,
   	username: String,
   	project: Array
});

module.exports = mongoose.model("team", TeamSchema);