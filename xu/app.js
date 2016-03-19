var express = require("express");
var app = express();

app.use(express.static(__dirname));

var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//加载mongoose数据库
var mongoose = require("mongoose");
var db = mongoose.createConnection('localhost', 'xushaofen');
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function() {
	//一次打开记录
});

var UserModel = require("./mongoose/model/user");
var ShopModel = require("./mongoose/model/shop");
//加载dish模型
var Dish = require("./mongoose/model/dish");

var session = require('express-session');

app.use(session({
	secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30
    }
}));

app.use(function(req,res,next){ 
    res.locals.user = req.session.user;   // 从session 获取 user对象
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){ 
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();  //中间件传递
});


//路由
app.get("/", function(req, res) {
	// ShopModel.find({},function(err,doc){
	// 	console.log(doc);
	// 	var shops = doc;
	// 	res.render("index",shops);
	// });
	var shops = [
	{
		id:"1",
		title:"String",
		poster:"String",
		address:"String",
		notice:"String",
		dish:"Array",
		salenum: "Number",
		beginetime: "String",
		endtime: "String",
		startingprice: "String",
		distributionfee: "String",
		distributiontime: "String"
	}
	];
	// var shopListHtml = require("../template/indexList").template(shops);
	template.config("escape",false);
	var shopListHtml = template("template/indexList",{shops: shops});

	res.render("index", {
		shoplist: shopListHtml
	});
});

app.get("/login", function(req, res) {
	res.render("login", {

	});
});

app.get("/register", function(req, res) {
	res.render("register", {

	});
});

app.get('/detail/:id', function(req, res) {

	if(!req.session.user){                     //到达/home路径首先判断是否已经登录
       req.session.error = "请先登录"
       res.redirect("/login");                //未登录则重定向到 /login 路径
  	} 
	res.render("detail", {

	});
});

app.get("/createShop", function(req, res) {
	res.render("create-shop", {

	});
});

app.get("/editShop:id", function(req, res) {
	res.render("edit-shop", {

	});
});

app.get("/orderconfirm", function(req, res) {

	if(!req.session.user){                     //到达/home路径首先判断是否已经登录
       req.session.error = "请先登录"
       res.redirect("/login");                //未登录则重定向到 /login 路径
  	} 
	res.render("order-confirm", {

	});
});


app.get("/myaccount", function(req, res) {

	if(!req.session.user){                     //到达/home路径首先判断是否已经登录
       req.session.error = "请先登录"
       res.redirect("/login");                //未登录则重定向到 /login 路径
  	} 
	res.render("myaccount", {

	});
});
app.all("/submitLogin",function(req,res){
	var param = req.query;
	res.redirect("/");
	UserModel.findOne({username:param.username},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
            console.log(err);
        }else if(!doc){                                 //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '用户名不存在';
            res.send(404);                            //    状态码返回404
        //    res.redirect("/login");
        }else{ 
            if(param.password != doc.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误";
                res.send(404);
            //    res.redirect("/login");
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = doc;
                res.send(200);
            //    res.redirect("/home");
            }
        }
    });
});

app.all("/submitRegister", function(req, res) {
	var param = req.body;
	var UserEntity = new UserModel({
		username: param.username,
		password: param.password
	});
	UserEntity.save();
 
	res.redirect("/login");

	// UserModel.find({},function(err,doc){
	// 	console.log("find");
	// });
	// UserModel.findOne({username: param.username},function(err,doc){   // 同理 /login 路径的处理方式
	// 	console.log("----------------------------------------doc",doc);
 //        if(err){ 
 //            res.send(500);
 //            req.session.error =  '网络异常错误！';
 //            console.log(err);
 //        }else if(doc){ 
 //            req.session.error = '用户名已存在！';
 //            res.send(500);
 //        }else{ 
 //            UserModel.create({                             // 创建一组user对象置入model
 //                username: param.username,
 //                password: param.password
 //            },function(err,doc){ 
 //                 if (err) {
 //                        res.send(500);
 //                        console.log(err);
 //                    } else {
 //                        req.session.error = '用户名创建成功！';
 //                        res.send(200);
 //                        res.redirect("/");
 //                    }
 //              });
 //        }
 //    });
});

app.all("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});

app.all("/submitCreateShop", function(req, res) {
	var param = req.body;
	console.log(req.body);
	var shopEntity = new ShopModel({
		title:param.title,
		poster:param.poster,
		address:param.address,
		notice:param.notice,
		dish:[],
		salenum: 0,
		beginetime: param.beginetime,
		endtime: param.endtime,
		startingprice: param.startingprice,
		distributionfee: param.distributionfee,
		distributiontime: param.distributiontime
	});
	shopEntity.save();
	res.status(200).json({success:"T"}).redirect("/detail?id="+ shopEntity._id +"");
	// ShopModel.create(param, function(){
	// 	res.status(200).json({success:"T"});
	// });
});

app.all("/submitEditShop", function(req, res) {
	var param = req.query;
	ShopModel.findById(id, function(err, shop) {
		var _id = shop._id; //需要取出主键_id
		delete person._id; //再将其删除
		shop = param;
		ShopModel.update({
			_id: _id
		}, shop, function(err) {});
		//此时才能用Model操作，否则报错
	});
});

app.all("/submitDeleteShop",function(req,res){
	var shopId = req.query.shopId;
	ShopModel.remove(shopId);
});


app.use(function(req, res, next) {
	res.status(404).send('Sorry cant find that!');
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});