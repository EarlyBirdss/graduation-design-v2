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
var ProjectModel = require("./models/project.js");
var TeamModel = require("./models/team.js");


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
  resave: true,
  saveUninitialized: true,
}));

app.get('/', function(req, res){

  var username = req.session.username;
  if(!username){
    res.redirect("/login");
  }else{

    res.render("index",{
      username: username
    });
  }

});

app.get("/login",function(req,res){
  res.render("login");
  // res.redirect("/register");
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

  UserModel.findOne({username: username}, function(err,user){

    if(err){
      res.status(500).json({
        success: "F",
        errMsg: "网络异常，请稍后再试"
      });
      console.log("find user failed======>",err);
    }

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
      res.status(200).json({
        success: "T",
        message: "登录成功"
      });
      // res.redirect("/");
    }

  });
});

app.all("/submitRegister",function(req,res,next){
  var param = req.body;
  var username = param.username;
  var password = param.password;
  UserModel.findOne({username: username}, function(err,user){

    if(err){
      console.log("find user failed======>",err);
    }

    if(user){
      res.status(200).json({
        success: "F",
        errMsg: "用户已存在"
      });
    }else{
      var user = new UserModel({
        username: username,
        password: password,
        project: [],
        team: []
      });

      user.save(function(err){
        if(err){
          console.log("user save failed");
          res.status(500).json({
            success: "F",
            errMsg: "数据库错误，请稍后再试"
          });
        }else{
          res.status(200).json({
            success: "T",
            message: "注册成功"
          });
          res.redirect("/login");
        }
      });
    }
  });
});

app.all("/submitLogout",function(req,res){
  req.session.username = null;
  res.status(200);
  res.redirect("/login");
});

app.all("/submitNewProject",function(req,res){
    var param = req.body;
    console.log(param);

    var project = new ProjectModel({
      projectname: param.projectname,
      teamname: param.teamname
    });

    var username = req.session.username;
    UserModel.findOne({username: username},function(err,user){
      user.project.push(param.projectname);
      var _id = user._id; //需要取出主键_id
      delete user._id;    //再将其删除
      UserModel.update({_id:_id},user,function(err){
        if(err){
          console.log("UserModel update failed");
          res.status(500).json({
            success: "F",
            message: "数据库错误，请稍后再试"
          });
        }
      });
      //此时才能用Model操作，否则报错
    });

    project.save(function(err){
      if(err){
        console.log("project save failed");
        console.log(err);
        res.status(500).json({
          success: "F",
          errMsg: "数据库错误，请稍后再试"
        });
      }else{
        res.status(200).json({
          success: "T",
          message: "创建成功"
        });
      }
    });
    
});

app.all("/submitNewTeam",function(req,res){
    var param = req.body;
    var team = new ProjectModel({
      teamname: param.teamname,
      teamdesc: param.teamdesc,
      teammember: [],
      teamtask: {}
    });
    var username = "math";
    UserModel.findOne({username: username},function(err,user){
      user.team.push(param.teamname);
      var _id = user._id; //需要取出主键_id
      delete user._id;    //再将其删除
      UserModel.update({_id:_id},user,function(err){
        if(err){
          console.log("UserModel update failed");
          res.status(500).json({
            success: "F",
            message: "数据库错误，请稍后再试"
          });
        }
      });
        //此时才能用Model操作，否则报错
      });
    // UserModel.update({username: username},{$set:{teamname:teamname.push(param.teamname)}},function(err){
    //   if(err){
    //     console.log("UserModel update failed");
    //     res.status(500).json({
    //       success: "F",
    //       message: "数据库错误，请稍后再试"
    //     });
    //   }
    // });
    // UserModel.findOne({username: username},function(err,user){
    //   if(err){
    //     console.log("query UserModel failed");
    //     console.log(err);
    //     return false
    //   }

    //   user.teamname.push(param.teamname);
    // });

    team.save(function(err){
      if(err){
        console.log("team save failed");
        res.status(500).json({
          success: "F",
          errMsg: "数据库错误，请稍后再试"
        });
        res.end();
      }else{
        res.status(200).json({
          success: "T",
          message: "创建成功"
        });
      }
    });
});


app.all("/submitQuitTeam",function(req,res){

  var username = req.session.username;
  var teamname = req.body.teamname;
  UserModel.findOne({username: username},function(err, user){
    if(err){
      req.status(500).json({
        success: "F",
        errMsg: "数据库错误，请稍后再试"
      });
    }else{
      var uIndex = user.team.indexOf(teamname);
      user.team.splice(uIndex,1);
      var _uid = user.id;
      UserModel.update({id: _uid},user,function(err){
        if(err){
          req.status(500).json({
            success: "F",
            errMsg: "数据库错误，请稍后再试"
          });
        }
      });
    }

    TeamModel.findOne({teamname: teamname},function(err, team){
      if(err){
        req.status(500).json({
          success: "F",
          errMsg: "数据库错误，请稍后再试"
        });
      }else{
        var tIndex = team.member.indexOf(username);
        team.member.splice(tIndex,1);
        var _tid = team.id;
        TeamModel.update({id: _tid},team,function(err){
          req.status(500).json({
            success: "F",
            errMsg: "数据库错误，请稍后再试"
          });
        });

        res.status(200).json({
          success:"T",
          message: "您已退出" + teamname
        });
      }
    });


  });
});