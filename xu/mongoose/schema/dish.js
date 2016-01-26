var mongoose = require("mongoose");
var DishSchema = mongoose.Schema({
	name:String,
	price:String
});

module.exports = DishSchema;