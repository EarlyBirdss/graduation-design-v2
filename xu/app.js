var express = require("express");
var app = express();

app.use(express.static(__dirname));
//加载hbs模板
var hbs = require("hbs");
//指定模板的后缀名为html
app.set('view engine', 'html');
// 运行hbs模块
app.engine('html', hbs.__express);

//加载mongoose数据库
var mongoose = require("mongoose");
var db = mongoose.createConnection('localhost','test'); 
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  //一次打开记录
});
//加载dish模型
var Dish = require("./mongoose/model/dish");
//路由
app.get("/",function(req,res){
	res.render("index",{

	});
});

app.get("/login",function(req,res){
	res.render("login",{

	});
});

app.get("/register",function(req,res){
	res.render("register",{

	});
});

app.get('/detail',function(req,res){
	res.render("detail",{

	})
});

app.get("/createShop",function(req,res){
	res.render("create-shop",{

	});
});

app.get("/orderconfirm",function(req,res){
	res.render("order-confirm",{

	});
});


app.get("/myaccount",function(req,res){
	res.render(myaccount",{

	});
});



app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!');
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);	
});