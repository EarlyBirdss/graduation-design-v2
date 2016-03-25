var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
	teamId: String,
	projectId: Number,
	taskId: Number,
	taskname: String,
	taskdesc: String,
	status: String,
	finished: Boolean,
	createtime: String,
	finishtime: String,
	comment: Array
});

module.exports = mongoose.model("task", TaskSchema);