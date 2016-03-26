# 记论文期间有关node.js/express/mongoose的一些疑惑

### 2016-03-23 晚，遇到一个问题
  
  mongoose中，module.find()方法是异步执行的，我在编写代码的时候，因为switch分支内部代码太多，我就将数据查询单独提出为一个新的函数，函数返回module.find()查询到的data,但在swtich分支接收数据的时候，都是undefined。参考网址：http://www.thinksaas.cn/ask/question/17013/   还是不太习惯异步的思维去编写代码啊……
  
  贴下代码段
  
    //switch 分支
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
      
      var html = template(uri, {
          data: data
      });
      res.send(html);
      next();
      
    });
    
    
    //getXXData()
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
                    console.log("1",data); //[]
                    return data;
                }

                for (var n = 0, len = thisproject.length; i < len; i++) {
                    var thistask = team.project.task;

                    if (!thistask.length) {
                        console.log("2",data);//[]
                        return data;
                    }

                    for (var j = 0, len = thistask.length; i < len; i++) {
                        thistask.projectname = projects[i];
                    }
                    task = task.concat(thistask);
                }

            });
        }
        console.log("3",data); //[]
        return data = task;
    });

    return data;
    }

//贴下getDiscoverData其中一个数据例子(team=[数据一]，project=[],task=[])的打印结果

        3[]
        1[]
        1[]
        
//没太懂1打印了两次，3打印一次，2一次都没有打印

然后我还在switch接受端，写了个定时器，检测data的值是否为undefined，因为就没有懂过异步到底是啥，到底啥影响，到底怎么用等等等等，就这样

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

然后打印结果就下面这样

    timer undefined
    timer undefined
    timer undefined
    timer undefined
    timer undefined
    timer undefined
    timer undefined
    timer undefined
    timer undefined


### 嗯？大写的懵逼！好像解决了？

前脚刚刚记下这个问题，感觉要晕好多天，刚刚试了一下好像就可以了？！callback 在写js的时候我也用过很多次啊，但是我这里一直以为getXXData里面我拿不到res啊啊啊啊啊！一直在纠结啊啊啊啊啊啊！形参跟实参我还是懵逼的啊啊啊啊啊！

然后解决的代码是这样的

      //switch分支
      app.get("/getSection", function(req, res, next) {
      
        //之前的代码
         ...
      
          var callback = function(data){
              console.log(data);
              var html = template(uri, {
                  data: data
              });
              res.send(html);
              next();
          }
      
          switch (req.query.type) {
              case "discover":
                  data = getDiscoverData(param,callback);  //加一个callback
                  break;
              //之前的代码
              ...
          }
          
      });
      //getXXData()
      function getDiscoverData(param,callback) {
          var username = param.username;
          var data = [];
          var task = [];
      
          UserModel.findOne({
              username: username
          }, function(err, user) {
            //之前的代码
             ...
      
              //执行callback
              callback.call(null,data);
      
          });
      
      }      
  
  这样的模式我在写js的时候用的也挺多
  
### 最后改一下，因为module.find是异步的，我又在for循环中执行callback，所以最后代码长这样
  

      function getDiscoverData(param, callback) {
          var username = param.username;
          var data = [];
          var thiscallback = function(data){
              callback.call(null,data);
          };
      
          UserModel.findOne({
              username: username
          }, function(err, user) {
      
              var teams = user.team;
              for (var i = 0, len = teams.length; i < len; i++) {
      
                  (function(i){
                      console.log("time[i]",teams[i],teams.length);
                      TeamModel.findOne({
                          _id: teams[i]
                      }, function(err, team) {
                          console.log("team",team);
                          var thisproject = team.project;
      
                          if(thisproject.length){
      
                              for (var n = 0, len = thisproject.length; i < len; i++) {
                                  var thistask = team.project.task;
      
                                  if(thistask.length){
      
                                      for (var j = 0, len = thistask.length; i < len; i++) {
                                          thistask.projectname = projects[i];
                                      }
                                      data = data.concat(thistask);
                                  }
                              }
                          }
      
                          console.log(i , teams.length);
                          if(i ===( teams.length-1) && typeof callback === "function"){
                              callback.call(null,data);
                          }
      
                      });
      
                  })(i);
              }
      
          });
      
      
      }
      
  然后又懵逼了，可能就是异步的，如上打印结果是这样的
  
    time[i] 56f2670f9e03e024914b8034 7
    time[i] 56f267844b7d477c97e6151d 7
    time[i] 56f29f172e9e5b34ac960416 7
    time[i] 56f2a06f822b1814b0292509 7
    time[i] 56f2a0b902ebf428b3b729c9 7
    time[i] 56f2a22ed87a0d2cb44e7503 7
    time[i] 56f2a6a844ebe418b0c6ffca 7
    team { teammember: [ 'm' ],
      project: [],
      __v: 0,
      teamdesc: 'ff',
      teamname: 'test',
      _id: 56f29f172e9e5b34ac960416 }
    2 7
    team { teammember: [ 'm' ],
      project: [],
      __v: 0,
      teamdesc: 'qq',
      teamname: 'qq',
      _id: 56f2a06f822b1814b0292509 }
    3 7
    team { teammember: [ 'm' ],
      project: [],
      __v: 0,
      teamdesc: 'f',
      teamname: 'f',
      _id: 56f2670f9e03e024914b8034 }
    0 7
    team { teammember: [ 'm' ],
      project: [],
      __v: 0,
      teamdesc: 'ss',
      teamname: 'tes',
      _id: 56f267844b7d477c97e6151d }
    1 7
    team { teammember: [ 'm' ],
      project: [],
      __v: 0,
      teamdesc: 'ff',
      teamname: 'ff',
      _id: 56f2a22ed87a0d2cb44e7503 }
    5 7
    team { teammember: [ 'm' ],
      project: [],
      __v: 0,
      teamdesc: 'ff',
      teamname: 'ff',
      _id: 56f2a6a844ebe418b0c6ffca }
    6 7
    []
    team { teammember: [ 'm' ],
      project: [],
      __v: 0,
      teamdesc: 'qq',
      teamname: 'qq',
      _id: 56f2a0b902ebf428b3b729c9 }
    4 7
    
  i的顺序是打乱的，所以i ===( teams.length-1)的判断逻辑是错误的，最后，写论文真的好坑爹啊，全是赶鸭子上架，也没有很正经的学习，全都按照自己的想法来做，根本不正规啊，常规的mongoose怎么查询我也不知道，偏要把它放在for循环里面，schame里面也没有添加任何静态方法，编写很多重复的代码，数据结构应该怎么组织也没有认真的思考过，子模块根本没用上。
