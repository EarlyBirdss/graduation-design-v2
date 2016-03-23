var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	teamId: String,
	projectId: Number,
	projectname: String,
	date: Date,
	task: Array
});

module.exports = mongoose.model("project", ProjectSchema);