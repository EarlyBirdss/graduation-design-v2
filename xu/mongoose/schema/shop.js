var mongoose = require("mongoose");
var ShopSchema = mongoose.Schema({
	title:String,
	poster:String,
	address:String,
	notice:String,
	dish:Array,
	salenum: Number,
	beginetime: String,
	endtime: String,
	startingprice: String,
	distributionfee: String,
	distributiontime: String,
	type:String
});

module.exports = ShopSchema;