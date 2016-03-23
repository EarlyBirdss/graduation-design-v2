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

    if (!username) {
        res.redirect("/login");
    } else {
        var data = {};
        data = getWorkspaceData({
            username: username
        });
        data = {
            teams: [],
            todo: [],
            doing: [],
            done: []
        };
        data.teams = [];
        data.username = username;
        data.userhead = getUserhead(username);
        res.render("index", data);
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
    var mouth = date.getMouth() + 1;
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


function getDiscoverData(param) {
    var username = param.username;
    var data = [];
    var task = [];

    UserModel.findOne({
        username: username
    }, function(err, user) {

        var team = user.team;
        for (var i = 0, len = team.length; i < len; i++) {

            TeamModel.findOne({
                _id: team[i]
            }, function(err, team) {
                var thisproject = team.project;

                if (!thisproject.length) {
                    console.log("1",data);
                    return data;
                }

                for (var n = 0, len = thisproject.length; i < len; i++) {
                    var thistask = team.project.task;

                    if (!thistask.length) {
                        console.log("2",data);
                        return data;
                    }

                    for (var j = 0, len = thistask.length; i < len; i++) {
                        thistask.projectname = projects[i];
                    }
                    task = task.concat(thistask);
                }

            });
        }
        console.log("3",data);
        return data = task;
    });

    return data;
}

function getMessageCenterData(param) {


}

function getProjectData(param) {
    var data = {
        teams: []
    };

    UserModel.findOne({
        username: param.username
    }, function(err, user) {
        var teams = user.teams;

        for (var i = 0, len = teams.length; i < len; i++) {
            TeamModel.findOne({
                teamId: teams[i]
            }, function(err, team) {
                data.teams.push(team);
            });
        }
    });
}

function getTaskDetailData(param) {
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

        return data;
    });
}

function getTaskListData(param) {
    //param teamid  projectid
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

        var project = team[param.projectId];
        // var task = project[param.taskId];
        var task = project.task;
        // data.teamId = param.teamId;
        data.teamId = team._id;
        data.projectId = param.projectId;
        data.teamname = team.teamname;
        data.projectname = project.projectname;
        for (var i = 0, len = task.length; i < len; i++) {
            switch (task[i].status) {
                case 1:
                    todo.push(task[i]);
                    break;
                case 2:
                    doing.push(task[i]);
                    break;
                case 3:
                    done.push(task[i]);
                    break;
                default:
                    break;
            }
        }
    });

    return data;
}

function getTeamData(param) {

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
        console.log(data);
        return data;
    });
}

function getTeamManagementData(param) {
    //param userId
    var username = param.username;
    var data = {
        team: []
    };

    UserModel.findOne({
        username: param.username
    }, function(err, user) {
        var teams = user.teams;

        for (var i = 0, len = teams.length; i < len; i++) {
            TeamModel.findOne({
                _id: teams[i]
            }, function(err, team) {
                data.team.push(team);
            });
        }
    });
}

function getWorkspaceData(param) {

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

        if (!teams.length) {
            return data;
        }

        for (var i = 0, len = teams.length; i < len; i++) {

            TeamModel.findOne({
                _id: teams[i]
            }, function(err, team) {
                data.teams.push({
                    teamId: team._id,
                    teamname: team.teamname
                });

                var projects = team.project || [];

                if (!projects.length) {
                    return data;
                }

                for (var j = 0, jlen = projects.length; i < jlen; j++) {
                    var task = projects[j].task;
                    if (task.length) {
                        for (var p = 0, plen = task.length; p < plen; p++) {
                            data.affairs = data.affairs.concat(task[p].comment);
                            switch (task[p].status) {
                                case 1:
                                    data.todo.push(task[i]);
                                    break;
                                case 2:
                                    data.doing.push(task[i]);
                                    break;
                                case 3:
                                    data.done.push(task[i]);
                                    break;
                                default:
                                    break;
                            }

                        }
                    }
                }

            });
        }
        return data;
    });
}

app.get("/getSection", function(req, res, next) {
    var uri = 'template/' + req.query.type;
    var param = req.query;
    param.username = req.session.username;
    var data;

    param.username = req.session.username;

    switch (req.query.type) {
        case "discover":
            data = getDiscoverData(param);
            break;
        case "messageCenter":
            data = getMessageCenterData(param);
            break;
        case "poject":
            data = getProjectData(param);
            break;
        case "taskDetail":
            data = getTaskDetailData(param);
            break;
        case "taskList":
            data = getTaskListData(param);
            break;
        case "team":
            data = getTeamData(param);
            break;
        case "teamManagement":
            data = getTeamManagementData(param);
            break;
        case "workSpace":
            data = getWorkspaceData(param);
            break;
        default:
            break;
    }
    console.log("421data", data);
    // var html = template(uri,{
    //     data: data
    // });
    var timer = setInterval(function(){
        console.log("timer",data);
        if(data){

            var html = template(uri, {
                data: data
            });
            res.send(html);
            next();

            clearInterval(timer);
        }

    },1000);
    
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
                    res.redirect("/login");
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
            req.status(500).json({
                success: "F",
                errMsg: "数据库错误，请稍后再试"
            });
        } else {
            // var pIndex = team.projcet.indexOf(param.projectname);
            // team.project[pIndex].task.push({
            //     taskname: param.taskname,
            //     status: param.status,
            //     finished: false
            // });
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
                req.status(500).json({
                    success: "F",
                    errMsg: "数据库错误，请稍后再试"
                });
            });

            res.status(200).json({
                success: "T",
                message: "创建成功",
                data: {
                    teamId: param.teamId,
                    projectId: projectId
                }
            });
        }
    });

    // var project = new ProjectModel({
    //     projectname: param.projectname,
    //     teamname: param.teamname
    // });

    // var username = req.session.username;
    // UserModel.findOne({
    //     username: username
    // }, function(err, user) {
    //     user.project.push(param.teamname);
    //     var _id = user._id; //需要取出主键_id
    //     delete user._id; //再将其删除
    //     UserModel.update({
    //         _id: _id
    //     }, user, function(err) {
    //         if (err) {
    //             console.log("UserModel update failed");
    //             res.status(500).json({
    //                 success: "F",
    //                 message: "数据库错误，请稍后再试"
    //             });
    //         }
    //     });
    //     //此时才能用Model操作，否则报错
    // });

    // project.save(function(err) {
    //     if (err) {
    //         console.log("project save failed");
    //         console.log(err);
    //         res.status(500).json({
    //             success: "F",
    //             errMsg: "数据库错误，请稍后再试"
    //         });
    //     } else {
    //         res.status(200).json({
    //             success: "T",
    //             message: "创建成功"
    //         });
    //     }
    // });

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
        teamovwer: req.session.username,
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
                    }
                });

                res.status(200).json({
                    success: "T",
                    message: "创建成功",
                    data: {
                        teamId: team._id
                    }
                });
            });
        }
    });
});


app.all("/submitQuitTeam", function(req, res) {

    var username = req.session.username;
    var teamname = req.body.teamId;
    UserModel.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            req.status(500).json({
                success: "F",
                errMsg: "数据库错误，请稍后再试"
            });
        } else {
            var uIndex = user.team.indexOf(teamname);
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
                TeamModel.update({
                    _id: _tid
                }, team, function(err) {
                    req.status(500).json({
                        success: "F",
                        errMsg: "数据库错误，请稍后再试"
                    });
                });

                res.status(200).json({
                    success: "T",
                    message: "您已退出" + teamname
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
                finished: false
            });

            var _tid = team.id;
            TeamModel.update({

                _id: _tid
            }, team, function(err) {
                req.status(500).json({
                    success: "F",
                    errMsg: "数据库错误，请稍后再试"
                });
            });

            res.status(200).json({
                success: "T",
                message: "创建成功"
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