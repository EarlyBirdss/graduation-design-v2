var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	projectname: String,
    teamname: String
});

module.exports = mongoose.model("project", ProjectSchema);