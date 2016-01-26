var mongoose = require("mongoose");
var DishSchema = require("../schema/dish");

var Dish = mongoose.model("Dish",DishSchema);

module.exports = Dish;