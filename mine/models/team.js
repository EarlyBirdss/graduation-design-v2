var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
    teamname: String,
    teamower: String,
    teammember: Array,
    teamdesc: String,
   	project: Array
});

module.exports = mongoose.model("team", TeamSchema);