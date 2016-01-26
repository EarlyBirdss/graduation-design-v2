var mongoose = require("mongoose");
var ShopSchema = mongoose.Schema({
	name:String,
	poster:String,
	address:String,
	notice:String
});

module.exports = ShopSchema;