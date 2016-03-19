var express = require("express");
var app = express();

app.use(express.static(__dirname));

app.listen(3000,function(){
	console.log("localhost start on port 3000");
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/worktile');
var UserModel = require("./models/user.js");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Successfully connected!');
});

var cookieParser = require('cookie-parser');
app.use(cookieParser()); 
var session = require('express-session'); 
// session配置
app.use(session({
  secret: "secret",
  cookie: {
    maxAge: 1000*60*30
  },
  resave: false,
  saveUninitialized: true,
}));

app.get('/', function(req, res){
  console.log(req);
  console.log(req.session.username);

  var username = req.session.username;
  if(!username){
    res.redirect("/login");
  }else{

    res.render("index",username);
  }

});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/getSection",function(req,res,next){
	var uri = 'template/'+req.query.type;
	var html = template(uri,{
		json: "json"
	});
	res.send(html);
	next();
});

app.all("/getWorkspace",function(req,res,next){
	res.send();
	next();
});

app.post("/submitLogin",function(req,res,next){
  var param = req.body;
  var username = param.username;
  var password = param.password;
  console.log(param);

  UserModel.findOne({username: username}, function(err,user){

    if(err){
      res.status(500).json({
        success: "F",
        errMsg: "网络异常，请稍后再试"
      });
      console.log("find user failed======>",err);
    }

    console.log(user);

    if(!user){
      res.status(200).json({
        success: "F",
        errMsg: "您还未注册，请注册后登陆"
      });
    }else if(user.password !== password){
      res.status(200).json({
        success: "F",
        errMsg: "用户名或密码错误"
      });
    }else{
      req.session.username = username;
      // res.status(200).redirect("/");
      res.redirect("/");
    }

  });
});

app.all("/submitRegister",function(req,res,next){
  var param = req.body;
  var username = param.username;
  var password = param.password;
  console.log(param);
  UserModel.findOne({username: username}, function(err,user){

    if(err){
      console.log("find user failed======>",err);
    }

    console.log(user);

    if(user){
      res.status(200).json({
        success: "F",
        errMsg: "用户已存在"
      });
    }else{
      var user = new UserModel({
        username: username,
        password: password
      });

      user.save(function(err){
        console.log("user save failed");
        console.log(err.message);
      });

      res.status(200).json({
        success: "T",
        message: "注册成功"
      });

      res.redirect("/login");
    }

  });
});

app.all("/submitLogout",function(req,res){
  req.session.username = null;
  res.status(200);
  res.redirect("/login");
});