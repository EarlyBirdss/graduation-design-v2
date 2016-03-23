var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
	teamId: String,
	projectId: Number,
	taskId: Number,
	taskname: String,
	status: Number,
	finished: Boolean,
	createtime: Date,
	finishtime: Date,
	comment: Array
});

module.exports = mongoose.model("task", TaskSchema);