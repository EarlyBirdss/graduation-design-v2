//ctrl + alt + f => JSFormat 
var express = require("express");
var app = express();

app.use(express.static(__dirname));

app.listen(3000, function() {
    console.log("localhost start on port 3000");
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
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
db.once('open', function callback() {
    console.log('Successfully connected!');
});

var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
// session配置
app.use(session({
    secret: "secret",
    cookie: {
        maxAge: 1000 * 60 * 30
    },
    resave: true,
    saveUninitialized: true,
}));

app.get('/home', function(req, res) {

    var username = req.session.username;
    // console.log("req.session.username", req.session.username);
    if (!username) {
        res.redirect("/login");
    } else {
        var data = {};
        var callback = function(data) {
            // console.log("home", data);
            data.username = username;
            data.userhead = getUserhead(username);
            res.render("index", data);
            res.end();
        };

        data = getWorkspaceData({
            username: username
        }, callback);


    }

});

app.get("/login", function(req, res) {
    res.render("login");
    // res.redirect("/register");
});

app.get("/register", function(req, res) {
    res.render("register");
});

function getTime() {

    var date = new Date();
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    var addZero = function(num) {
        return num > 9 ? num + "" : "0" + num;
    };

    return {
        toString: function() {
            return year + "-" + addZero(mouth) + "-" + addZero(day);
        },
        valueOf: function() {
            return year + "-" + addZero(mouth) + "-" + addZero(day) + " " + addZero(hour) + ":" + addZero(minute);
        }
    };
}


function getUserhead(string) {
    var code = string.charCodeAt(0);
    return 97 <= code <= 122 || 65 <= code <= 90 ? string.charAt(0).toLocaleUpperCase() : string.charAt(0);
}


function getDiscoverData(param, callback) {
    var username = param.username;
    var data = [];

    UserModel.findOne({
        username: username
    }, function(err, user) {

        var teams = user.team;

        if (!teams.length && typeof callback === "function") {
            callback.call(null, data);
        }

        for (var i = 0, len = teams.length; i < len; i++) {

            (function(i) {
                TeamModel.findOne({
                    _id: teams[i]
                }, function(err, team) {
                    var projects = team.project;

                    if (projects.length) {

                        for (var n = 0, len = projects.length; n < len; n++) {
                            var tasks = projects[n].task;

                            if (tasks.length) {

                                for (var j = 0, len = tasks.length; j < len; j++) {
                                    tasks[j].projectname = projects[n].projectname;
                                }
                                data = data.concat(tasks);
                            }
                        }
                    }

                    if (i === (teams.length - 1) && typeof callback === "function") {
                        callback.call(null, data);
                    }

                });

            })(i);
        }

    });


}

function getMessageCenterData(param) {


}

function getProjectData(param, callback) {

    var data = {
        teams: []
    };

    UserModel.findOne({
        username: param.username
    }, function(err, user) {
        var teams = user.team;

        if (!teams.length && typeof callback === "function") {
            callback.call(null, data);
        }

        for (var i = 0, len = teams.length; i < len; i++) {

            (function(i) {

                TeamModel.findOne({
                    _id: teams[i]
                }, function(err, team) {

                    data.teams.push(team);

                    if (i === (teams.length - 1) && typeof callback === "function") {
                        callback.call(null, data);
                    } 

                });

            })(i);
        }

    });
}

function getTaskDetailData(param, callback) {
    //param teamid  projectid taskid
    var data = {
        teamId: "",
        teamname: "",
        projectId: "",
        projectname: "",
        comment: []
    };

    TeamModel.findOne({
        _id: param.teamId
    }, function(err, team) {

        var project = team[param.projectId];
        var task = project[param.taskId];
        // data.teamId = param.teamId;
        data.teamId = team._id;
        data.projectId = param.projectId;
        data.teamname = team.teamname;
        data.projectname = project.projectname;
        data.comment = task.comment;

        if (typeof callback === "function") {
            callback.call(null, data);
        }

    });
}

function getTaskListData(param, callback) {
    //param teamid  projectid
    console.log("param",param);
    var data = {
        teamId: "",
        teamname: "",
        projectId: "",
        projectname: "",
        todo: [],
        doing: [],
        done: []
    };

    TeamModel.findOne({
        _id: param.teamId
    }, function(err, team) {

        var project = team.project[param.projectId];
        // var task = project[param.taskId];
        console.log("project",project);
        var task = project.task;
        // data.teamId = param.teamId;
        data.teamId = team.id;
        data.projectId = param.projectId;
        data.teamname = team.teamname;
        data.projectname = project.projectname;
        for (var i = 0, len = task.length; i < len; i++) {
            switch (task[i].status) {
                case "1":
                    todo.push(task[i]);
                    break;
                case "2":
                    doing.push(task[i]);
                    break;
                case "3":
                    done.push(task[i]);
                    break;
                default:
                    break;
            }
        }

        if (typeof callback === "function") {
            callback.call(null, data);
        }

    });

}

function getTeamData(param, callback) {

    //param teamid 
    var data = {
        teamId: "",
        teamname: "",
        member: [],
        projects: []
    };

    TeamModel.findOne({
        _id: param.teamId
    }, function(err, team) {
        data.teamId = team._id;
        data.teamname = team.teamname;

        for (var i = 0, len = team.teammember.length; i < len; i++) {

            data.member.push({
                userhead: getUserhead(team.teammember[i]),
                username: team.teammember[i]
            });

        }

        // var project = team[param.projectId];
        // var task = project[param.taskId];

        // data.teamId = param.teamId;
        // data.teamid = team._id;
        // // data.projectId = param.projectId;
        // data.teamname = team.teamname;
        // // data.projectname = project.projectname;
        // data.projects = team.projects;

        // for(var i = 0, len = task.length; i < len; i++) {
        //     switch (task[i].status){
        //         case 1:
        //             todo.push(task[i]);
        //             break;
        //         case 2: 
        //             doing.push(task[i]);
        //             break;
        //         case 3: 
        //             done.push(task[i]);
        //             break;
        //         default:
        //             break;
        //     }
        // }

        if (typeof callback === "function") {
            callback.call(null, data);
        }

    });
}

function getTeamManagementData(param, callback) {
    //param userId
    var username = param.username;
    var data = {
        team: []
    };

    UserModel.findOne({
        username: param.username
    }, function(err, user) {
        var teams = user.team;

        if (!teams.length && typeof callback === "function") {
            callback.call(null, data);
        }


        for (var i = 0, len = teams.length; i < len; i++) {

            (function(i) {

                TeamModel.findOne({
                    _id: teams[i]
                }, function(err, team) {

                    data.team.push(team);

                    if (i === (teams.length - 1) && typeof callback === "function") {
                        callback.call(null, data);
                    }

                });

            })(i);

        }

    });
}

function getWorkspaceData(param, callback) {
    console.log("workSpace param", param);
    //param 
    var username = param.username;
    // var teamIds = [];
    var data = {
        teams: [],
        affairs: [],
        todo: [],
        doing: [],
        done: []
    };

    UserModel.findOne({
        username: username
    }, function(err, user) {
        var teams = user.team;
        // teamIds = teams;

        if (!teams.length && typeof callback === "function") {
            callback.call(null, data);
        }

        for (var i = 0, len = teams.length; i < len; i++) {

            (function(i) {
                TeamModel.findOne({
                    _id: teams[i]
                }, function(err, team) {

                    data.teams.push({
                        teamId: team._id,
                        teamname: team.teamname
                    });

                    var projects = team.project || [];

                    if (projects.length) {
                        console.log("project",projects);
                        for (var j = 0, jlen = projects.length; j < jlen; j++) {
                            var task = projects[j].task;
                            console.log("task",task);
                            if (task.length) {
                                for (var p = 0, plen = task.length; p < plen; p++) {

                                    data.affairs = data.affairs.concat(task[p].comment);
                                    console.log("data.affairs",data.affairs);
                                    switch (task[p].status) {
                                        case "1":
                                            data.todo.push(task[i]);
                                            break;
                                        case "2":
                                            data.doing.push(task[i]);
                                            break;
                                        case "3":
                                            data.done.push(task[i]);
                                            break;
                                        default:
                                            break;
                                    }

                                }
                            }
                        }
                    }

                    if (i === (teams.length - 1) && typeof callback === "function") {
                        callback.call(null, data);
                    }

                });
            })(i);
        }


    });
}

app.get("/getSection", function(req, res, next) {
    var uri = 'template/' + req.query.type;
    console.log("req.body",req.body);
    console.log("req.query");
    param = req.query.data || {};
    param.username = req.session.username;
    var data;

    param.username = req.session.username;

    var callback = function(data) {
        console.log("callback data", data);
        var html = template(uri, data);
        res.send(html);
        next();
    };

    switch (req.query.type) {
        case "discover":
            data = getDiscoverData(param, callback);
            break;
        case "messageCenter":
            data = getMessageCenterData(param, callback);
            break;
        case "project":
            data = getProjectData(param, callback);
            break;
        case "taskDetail":
            data = getTaskDetailData(param, callback);
            break;
        case "taskList":
            data = getTaskListData(param, callback);
            break;
        case "team":
            data = getTeamData(param, callback);
            break;
        case "teamManagement":
            data = getTeamManagementData(param, callback);
            break;
        case "workSpace":
            data = getWorkspaceData(param, callback);
            break;
        default:
            break;
    }

});

app.all("/getWorkspace", function(req, res, next) {
    res.send();
    next();
});

app.post("/submitLogin", function(req, res, next) {
    var param = req.body;
    var username = param.username;
    var password = param.password;

    UserModel.findOne({
        username: username
    }, function(err, user) {

        if (err) {
            res.status(500).json({
                success: "F",
                errMsg: "网络异常，请稍后再试"
            });
            console.log("find user failed======>", err);
        }

        if (!user) {
            res.status(200).json({
                success: "F",
                errMsg: "您还未注册，请注册后登陆"
            });
        } else if (user.password !== password) {
            res.status(200).json({
                success: "F",
                errMsg: "用户名或密码错误"
            });
        } else {
            req.session.username = username;
            res.status(200).json({
                success: "T",
                message: "登录成功"
            });
            // res.redirect("/");
        }

    });
});

app.all("/submitRegister", function(req, res, next) {
    var param = req.body;
    var username = param.username;
    var password = param.password;
    UserModel.findOne({
        username: username
    }, function(err, user) {

        if (err) {
            console.log("find user failed======>", err);
        }

        if (user) {
            res.status(200).json({
                success: "F",
                errMsg: "用户已存在"
            });
        } else {
            var user = new UserModel({
                username: username,
                password: password,
                team: []
            });

            user.save(function(err) {
                if (err) {
                    console.log("user save failed");
                    res.status(500).json({
                        success: "F",
                        errMsg: "数据库错误，请稍后再试"
                    });
                } else {
                    res.status(200).json({
                        success: "T",
                        message: "注册成功"
                    });
                    // res.redirect("/login");
                }
            });
        }
    });
});

app.all("/submitLogout", function(req, res) {
    req.session.username = null;
    res.status(200);
    res.redirect("/login");
});

app.all("/submitNewProject", function(req, res) {
    var param = req.body;
    console.log(param);

    TeamModel.findOne({
        _id: param.teamId
    }, function(err, team) {

        if (err) {
            res.status(500).json({
                success: "F",
                errMsg: "数据库错误，请稍后再试"
            });
        } else if(team){
            console.log(team);
            var projectId = team.project.length;
            team.project.push({
                teamId: param.teamId,
                projectId: projectId,
                projectname: param.projectname,
                task: []
            });

            var _tid = team.id;
            TeamModel.update({
                _id: param.teamId
            }, team, function(err) {
                console.log("update");
                console.log(err);
                if(err){
                    console.log("if");
                  res.status(500).json({
                      success: "F",
                      errMsg: "数据库错误，请稍后再试"
                  });  

              }else{
                res.status(200).json({
                    success: "T",
                    message: "创建成功",
                    data: {
                        teamId: param.teamId,
                        projectId: projectId
                    }
                });
                res.end();
              }
                
            });
            
        }
    });
});

app.all("/submitNewTeam", function(req, res) {
    var param = req.body;
    var username = req.session.user;


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

    var team = new TeamModel({
        teamname: param.teamname,
        teamdesc: param.teamdesc,
        teamower: req.session.username,
        teammember: [req.session.username],
        project: []
    });


    team.save(function(err) {
        if (err) {
            console.log("team save failed");
            res.status(500).json({
                success: "F",
                errMsg: "数据库错误，请稍后再试"
            });
            res.end();
        } else {
            UserModel.findOne({
                username: req.session.username
            }, function(err, user) {
                console.log("user", user);
                user.team.push(team._id);
                var _id = user._id; //需要取出主键_id
                delete user._id; //再将其删除
                UserModel.update({
                    _id: _id
                }, user, function(err) {
                    if (err) {
                        console.log("UserModel update failed");
                        res.status(500).json({
                            success: "F",
                            message: "数据库错误，请稍后再试"
                        });
                    }else{
                        res.status(200).json({
                            success: "T",
                            message: "创建成功",
                            data: {
                                teamId: team._id,
                                teamname: team.teamname
                            }
                        });
                    }
                });
                
            });
        }
    });
});


app.all("/submitQuitTeam", function(req, res) {

    var username = req.session.username;
    var teamId = req.body.teamId;
    UserModel.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            req.status(500).json({
                success: "F",
                errMsg: "数据库错误，请稍后再试"
            });
        } else {
            var uIndex = user.team.indexOf(teamId);
            user.team.splice(uIndex, 1);
            var _uid = user.id;
            UserModel.update({
                _id: _uid
            }, user, function(err) {
                if (err) {
                    req.status(500).json({
                        success: "F",
                        errMsg: "数据库错误，请稍后再试"
                    });
                }
            });
        }

        TeamModel.findOne({
            _id: teamId
        }, function(err, team) {
            if (err) {
                req.status(500).json({
                    success: "F",
                    errMsg: "数据库错误，请稍后再试"
                });
            } else {

                var tIndex = team.member.indexOf(username);
                team.member.splice(tIndex, 1);
                var _tid = team.id;
                console.log("768team",team);
                TeamModel.update({
                    _id: _tid
                }, team, function(err) {

                    if(err){
                       req.status(500).json({
                           success: "F",
                           errMsg: "数据库错误，请稍后再试"
                       }); 
                   }else{
                        res.status(200).json({
                            success: "T",
                            message: "您已退出" + teamname
                        });
                   }
                    
                });
            }
        });

    });
});

app.all("/submitNewTask", function(req, res) {
    //param teamId projectId
    var param = req.body;

    TeamModel.findOne({
        _id: param.teamId
    }, function(err, team) {

        if (err) {
            req.status(500).json({
                success: "F",
                errMsg: "数据库错误，请稍后再试"
            });
        } else if (team) {
            // var pIndex = team.project.indexOf(param.projectname);
            var taskId = team.project[param.projectId].task.length;

            team.project[param.projectId].task.push({
                teamId: param.teamId,
                projectId: param.projectId,
                taskId: taskId,
                taskname: param.taskname,
                status: param.status,
                finished: false,
                comment:[],
                createtime: getTime().valueOf(),
                finishtime: ""
            });

            var _tid = team.id;
            TeamModel.update({

                _id: _tid
            }, team, function(err) {
                if(err){
                   res.status(500).json({
                    success: "F",
                    errMsg: "数据库错误，请稍后再试"
                }); 
                }
                res.status(200).json({
                    success: "T",
                    message: "创建成功",
                    data:{
                        teamId: param.teamId,
                        projectId: param.projectId,
                        taskId: taskId,
                        taskname: param.taskname 
                    }
                });
                
            });
           
        } else {
            res.status(500).json({
                success: "F",
                errMsg: "后台错误，请稍后再试"
            });
        }
    });
});

app.all("/submitFinishTask", function(req, res) {
    //param teamId projectId taskId
    var param = req.body;

    TeamModel.findOne({
        _id: param.teamId
    }, function(err, team) {

        if (err) {
            req.status(500).json({
                success: "F",
                errMsg: "数据库错误，请稍后再试"
            });
        } else if (team) {
            // var pIndex = team.project.indexOf(param.projectname);
            var project = team.project[param.projectId];
            // var tIndex = project.task.indexOf(param.teamname);

            project.task[param.taskId].finished = true;

            var _tid = team.id;
            TeamModel.update({
                _id: param.teamId
            }, team, function(err) {
                req.status(500).json({
                    success: "F",
                    errMsg: "数据库错误，请稍后再试"
                });
            });

            res.status(200).json({
                success: "T",
                message: "执行成功"
            });
        } else {
            res.status(500).json({
                success: "F",
                errMsg: "后台错误，请稍后再试"
            });
        }
    });
});