var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	teamId: String,
	projectId: String,
	projectname: String,
	date: String,
	task: Array
});

module.exports = mongoose.model("project", ProjectSchema);