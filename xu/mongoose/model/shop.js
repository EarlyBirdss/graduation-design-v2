var mongoose = require("mongoose");
var ShopSchema = require("../schema/shop");

var Shop = mongoose.model("Shop",DishSchema);

module.exports = Shop;