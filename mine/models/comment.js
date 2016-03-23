var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
	teamId: String,
	projectId: Number,
	taskId: Number,
	user: String,
	userheader: String,
	content: String,
	date: String
});

module.exports = mongoose.model("task", TaskSchema);