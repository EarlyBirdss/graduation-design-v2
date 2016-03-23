# graduation-design-v2

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
      
              if(typeOf(callback) === "function"){ //执行callback
                  callback.call(null,data);
              }
      
          });
      
          return data;
      }      
  
  这样的模式我在写js的时候用的也挺多
