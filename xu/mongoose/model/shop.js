var mongoose = require("mongoose");
var ShopSchema = require("../schema/shop");

var Shop = mongoose.model("Shop",ShopSchema);

module.exports = Shop;