seajs.config(
{
	// 激活 shim 插件
	plugins: ['shim']
 
	// shim 配置项
	,alias: 
	{
		// jQuery 的 shim 配置
		'jquery': 
		{
			src: 'http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js',
			exports: 'jQuery'
		}
	}
 
	,paths:
	{
		'js':'../js/'//这个路径是以sea.js文件为基础的
		,'lib':'../lib'
	}
 
	,map:
	[
		//防止js文件夹下的文件被缓存
		[/(.*js\/[^\/\.]*\.(?:js))(?:.*)/,'$1?_='+new Date().getTime()]
	]
 
	,debug:true
});
define(function(require, exports, module) {

	"use strict";
	// var submit = seajs.use("submit");
	console.log(require("/src/scripts/submit"));
	var submit = require("/src/scripts/submit").submit;
	var layer = require("/plugin/layer/layer");
	init();

	function init() {
		initTab();
		addListener();
	}

	function addListener() {

		//topbar
		$("#J_header").on("click", ".J_new", function() {
			//新建
			$(".J_new_pop").slideToggle("fast");

		}).on("click", ".J_msg", function() {
			//消息
			renderSection($(this).data("type"));

		}).on("click", ".J_user", function() {
			//用户可操作条
			$(".J_user_pop").slideToggle("fast");

		}).on("click", ".J_new_project", function() {
			//新建项目
			// $(".J_new_pop").hide();
			$(".J_new_project_pop").slideDown("fast");

		}).on("click", ".J_new_team", function() {
			//新建团队
			// $(".J_new_pop").hide();
			$(".J_new_team_pop").slideDown("fast");

		}).on("click", ".J_new_cle", function() {
			//新建取消按钮
			$(this).parents(".new-pop").slideUp("fast");

		}).on("click", ".J_btn_new_project", function() {
			//新建项目确定按钮
			submit.newProject($(this), function(data) {

				$("#J_header .J_new_cle").trigger("click");

				$("#J_aside .a-list").each(function(){
					console.log("50",$(this),data);
					if($(this).data("teamid") === data.teamId){
						var projectListHtml = "<li class=\"project-list\" data-type=\"taskList\" data-teamId=\""+ data.teamId +"\" data-projectId=\""+data.projectId+"\">"+
												"<span class=\"glyphicon glyphicon-folder-open\"></span>"+ data.projectname+"</li>";
						$(this).find("ul").append(projectListHtml);
					}
				});

				renderSection("tasList", data);
			});

		}).on("click", ".J_btn_new_team", function() {
			//新建团队确定按钮
			submit.newTeam($(this), function(data) {

				$("#J_header .J_new_cle").trigger("click");
				renderSection("team", data);
				var projectower = $("#projectower");
				var teamLiHtml = "<li class=\"a-list\" data-type=\"team\" data-teamId=\""+data.teamId+"\">"+
									"<span class=\"glyphicon glyphicon-briefcase\"></span>"+ data.teamname +
										"<ul></ul>"+
								"</li>";
				$("#J_aside ul").append(teamLiHtml);
				if (projectower.length) {
					projectower.append("<option value=\"" + data.teamId + "\">" + data.teamname + "</option>");
				} else {
					var teamListHtml = "<select class=\"new-select\" name=\"projectower\" id=\"projectower\">" +
						"<option value==\"" + data.teamId + "\">" + data.teamname + "</option>" +
						"</select>";
					$(".J_team_list").append(teamListHtml).find("p").remove();
					$(".J_btn_new_project").removeAttr("disabled");

				}
			});

		}).on("click", ".J_team_manage", function() {
			//团队管理
			renderSection($(this).data("type"));

		}).on("click", ".J_user_exit", function() {
			//退出当前登录
			submit.userExit($(this));

		});

		// $(".J_w_tab_body").on("click",".event-itm",function(){
		// 	//
		// 	slideOutTaskDetail();
		// });

		// $(".J_tab2_body").on("click",".ws-2-item",function(){
		// 	//
		// 	slideOutTaskDetail($(this));
		// });

		// $(".J_dit_tab_body").on("click",".ws-2-item",function(){
		// 	//
		// 	slideOutTaskDetail($(this));
		// });

		$("#J_task_detail").on("click", ".J_close_pop", function() {
			//关闭任务详情滑窗
			slideInTaskDetail();
		}).on("click",".J_taskdesc_cfm",function(){
			//添加任务描述
			submit.addTaskDesc($(this),function(data){

			});
		}).on("click",".J_new_comment_cfm",function(){
			//评论
			submit.addComment($(this),function(data){

			});
		});

		$("#article").on("click", ".event-itm", function() {
			//工作台 动态
			submit.getTaskDetail($(this),slideOutTaskDetail);
		}).on("click", ".ws-2-item", function() {
			//工作台 任务
			submit.getTaskDetail($(this),slideOutTaskDetail);
		}).on("click", ".J_task_title", function() {
			//项目详情（任务列表） task
			submit.getTaskDetail($(this),slideOutTaskDetail);
		}).on("click", ".J_project_item", function() {
			//加载项目详情 =>tasklist
			var $this = $(this);
			var data = {
				// teamId: $this.data("teamId"),
				// projectId: $this.data("projectId")
				teamId: $this.data("teamid"),
				projectId: $this.data("projectid")
			};

			renderSection($(this).data("type"), data);
		}).on("click", ".J_new_task_btn", function() {

			$(this).hide().parents(".task-box").find(".form").slideDown();

		}).on("click", ".J_new_task_cfm", function() {
			//新建任务确定按钮
			var $this = $(this);

			submit.newTask($(this),function(data) {

				var taskItemHTML = "<li><input type=\"checkbox\" class=\"task-fanish J_task_fanish_btn\">" +
					"<span class=\"J_task_title\" data-taskId=" + data.taskId + ">" + data.taskname + "</span>" +
					"<span class=\"glyphicon glyphicon-remove J_delete_task\"></span>" +
					"</li>";

				$this.parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
				$this.parents(".form").siblings(".task-status").after(taskItemHTML);
			});
		}).on("click", ".J_new_task_cle", function() {

			//新建任务取消按钮
			$(this).parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
		}).on("click", ".J_task_fanish_btn", function() {
			//完成任务按钮
			var $this = $(this);
			submit.finishTask($(this),function(){
				$this.next(".J_task_title").addClass("finished");

			});
		}).on("click",".J_add_teamer",function(){
			//团队 添加成员
			$(this).slideUp("fast").next(".add-teamer-form").slideDown("fast");

		}).on("click",".J_add_teamer_cle",function(){
			//团队 取消添加成员
			$(this).parents(".add-teamer-form").slideUp("fast").prev(".J_add_teamer").slideDown("fast");

		}).on("click",".J_add_teamer_cfm",function(){
			//团队 确认添加成员
			submit.addTeamer($(this),function(data){
				var teamerListHtml = "<li class=\"teamer-item J_teamer_item\">"+
										"<i class=\"user-img circle-img\">"+ data.userhead+"</i>" + data.teamername+
									"</li>";
				$("#J_team .J_teamer_item").parent().append(teamerListHtml);
				$(".J_add_teamer_cle").trigger("click");
			});
		}).on("click",".J_delete_task",function(){
			//删除任务
			var $this = $(this);
			submit.deleteTask($this,function(){
				$this.parent("li").remove();
			});
		});



		//aside Tab
		$("#J_aside").on("click", ".a-list", function() {
			var $this = $(this);
			$this.addClass("cur").siblings().removeClass("cur");
			if(!$this.data("teamid")){
				renderSection($this.data("type"));
			}else{

				var data = {
					teamId: $this.data("teamid")
				};

				renderSection($this.data("type"),data);
			}
			
		}).on("click",".project-list",function(){
			var $this = $(this);
			var data = {
				teamId: $this.data("teamid"),
				projectId: $this.data("projectid")
			};

			renderSection($this.data("type"),data);
			return false;
		});


	}

	function initTab() {
		// 工作台
		var workspacetab = new Tab({
			tabHead: ".J_w_tab_head",
			tabBody: ".work-space",
			headCurClass: "tt-cur",
			bodyCurClass: "cur",
			headItem: ".tt-itm",
			bodyItem: ".ws-main"
		});
		// 工作台
		new Tab({
			tabHead: ".J_tab2_head",
			tabBody: ".J_tab2_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".ws-2-tab",
			bodyItem: ".ws-2-tab"
		});
		// 工作台
		new Tab({
			tabHead: ".ws-ad-box",
			tabBody: ".J_tab2_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".aside-itm",
			bodyItem: ".ws-2-tab",
			beforeClick: function() {
				workspacetab.click($(".J_w_tab_head .tt-itm").eq(1));
			}
		});

		// 发现
		new Tab({
			tabHead: ".J_dit_tab_head",
			tabBody: ".J_dit_tab_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".ditt-itm",
			bodyItem: ".ws-2-tab"
		});

		//消息
		new Tab({
			tabHead: ".J_ms_tab_head",
			tabBody: ".J_ms_tab_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".ms-tabs",
			bodyItem: ".ms-tabs-item"
		});

		//团队
		new Tab({
			tabHead: ".J_team_tab_head",
			tabBody: ".J_team_tab_body",
			headCurClass: "tt-cur",
			bodyCurClass: "cur",
			headItem: ".tt-itm",
			bodyItem: ".ws-main"
		});
	}

	function renderSection(type, data) {
		console.log({
			type: type,
			data: data
		});
		$.ajax({
			type: "get",
			data: {
				type: type,
				data: data
			},
			datatype: "json",
			url: "/getSection",
			success: function(data) {
				$(".section").replaceWith(data);
			}
		});
	}

	function slideOutTaskDetail() {
		//TODO 后台获取数据

		$("#J_task_detail").animate({
			width: "55%"
		}, 1000);
	}

	function slideInTaskDetail() {

		$("#J_task_detail").animate({
			width: "0"
		}, 1000);
	}

});
define(function  (require, exports, module) { 

	"use strict";

	init();

	function init(){
		addLinstener();
	} 

	function addLinstener(){
		$("#form").on("click",".J_btn_login",function(){
			submit();
		});
	}

	function submit(){
		var data = {
			username: $("#username").val(),
			password: $("#password").val()
		}
		if(!data.username || !data.password){
			window.alert("请输入完整登陆信息");
		}else{
			$.ajax({
				url:"/submitLogin",
				type:"post",
				data: data,
				success: function(data){
					if(data.success === "F"){
						window.alert(data.errMsg);
					}else{
						window.location.href = "/home";
					}
				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		}
	}

});

define(function  (require, exports, module) { 

	"use strict";

	init();

	function init(){
		addLinstener();
	} 

	function addLinstener(){
		$("#J_btn_register").on("click",function(){
			submit();
		});
	}

	function submit(){
		var data = {
			username: $("#username").val(),
			password: $("#password").val()
		}
		if(!data.username || !data.password){
			window.alert("请输入完整登陆信息");
		}else{
			$.ajax({
				url:"/submitRegister",
				type:"post",
				data: data,
				success: function(data){
					console.log(data);
					if(data.success === "F"){
						window.alert(data.errMsg);
					}else{
						window.location.href = "/login";
						// window.alert(data.message);
					}
				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		}
	}

});
define(function(require, exports, module) {

	"use strict";

	var submit = {
		newProject: function($this, callback) {
			//新建项目
			var data = {
				projectname: $("#projectname").val(),
				teamId: $("#projectower").val()
			};

			if (!data.projectname) {
				layer.alert("请填写项目名称");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/submitNewProject",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg);
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null, data.data);
						}
					}
				},
				error: function(data) {
					layer.alert(data.errMsg);
				}
			});
		},
		newTeam: function($this, callback) {
			//新建团队

			var data = {
				teamname: $("#teamname").val(),
				teamdesc: $("#teamdesc").val()
			};

			if (!data.teamname) {
				layer.alert("请填写团队名称");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/submitNewTeam",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						layer.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							console.log(callback);
							callback.call(null, data.data);
						}
					}
				},
				error: function(data) {
					layer.alert(data.errMsg);
				}
			});
		},
		userExit: function($this) {
			//退出当前用户
			$.ajax({
				type: "post",
				url: "/submitLogout",
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						window.alert(data.message);
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		quitTeam: function($this) {

			var data = {
				teamId: $this.data("teamId")
			};

			$.ajax({
				type: "post",
				url: "/submitQuitTeam",
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						window.alert(data.message);
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		newTask: function($this, callback) {
			var projectTitle = $this.parents(".J_project_title");
			var data = {
				teamId: projectTitle.data("teamid"),
				projectId: projectTitle.data("projectid"),
				taskname: $this.prev(".J_task_name").val(),
				status: projectTitle.data("status")
			};
			console.log(data);

			$.ajax({
				type: "post",
				url: "/submitNewTask",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null, data.data);
						}
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		finishTask: function($this, callback) {

			var projectTitle = $this.parents(".J_project_title");

			var data = {
				teamId: projectTitle.data("teamid"),
				projectId: projectTitle.data("projectid"),
				taskId: $this.next(".J_task_title").data("taskid")
			};

			$.ajax({
				type: "post",
				url: "/submitFinishTask",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null, data.data);
						}
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		deleteTask: function($this,callback){
			var projectTitle = $this.parents(".J_project_title");
			var data = {
				teamId: projectTitle.data("teamid"),
				projectId: projectTitle.data("projectid"),
				taskId: $this.prev(".J_task_title").data("taskid")
			};

			$.ajax({
				type: "post",
				url: "/submitDeleteTask",
				datatype: "json",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null);
						}
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		getTaskDetail: function($this,callback){
			var data;
			if($this.hasClass("J_task_title")){
				var J_project_title = $this.parents(".J_project_title");
				data = {
					teamId: J_project_title.data("teamid"),
					projectId: J_project_title.data("projectid"),
					taskId: $this.data("taskid")
				};

			}else {
				data = {
					teamId: $this.data("teamid"),
					projectId: $this.data("projectid"),
					taskId: $this.data("taskid")
				};
			}
			

			$.ajax({
				type: "get",
				url: "/getSection",
				datatype: "json",
				data: {type: "taskDetail",data: data},
				success: function(data){
					
					$("#J_task_detail").html(data);
					if (typeof callback === "function") {
						callback.call(null);
					}
				}
			});
		},
		addTeamer: function($this,callback){
			var data = {
				teamId: $this.parents(".add-teamer-form").data("teamid"),
				teamername: $("#teamername").val()
			};

			if(!data.teamername){
				window.alert("请输入添加成员用户名");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/addTeamer",
				datatype: "json",
				data: data,
				success: function(data){
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					if(data.errMsg){
						window.alert(data.errMsg);
					}
				}
			});
		},
		addTaskDesc: function($this,callback){
			var J_taskdesc_form = $(".J_taskdesc_form");
			var data = {
				teamId: J_taskdesc_form.data("teamid"),
				projectId: J_taskdesc_form.data("projectid"),
				taskId: J_taskdesc_form.data("taskid"),
				taskdesc: $("#taskdesc").val()
			};

			$.ajax({
				type: "post",
				url: "/submitTaskDesc",
				datatype: "json",
				data: data,
				success: function(data){
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					if(data.errMsg){
						window.alert(data.errMsg);
					}
				}
			});
		},
		addComment: function($this,callback){
			var J_new_comment_form = $(".J_new_comment_form");

			var data = {
				teamId: J_new_comment_form.data("teamid"),
				projectId: J_new_comment_form.data("projectid"),
				taskId: J_new_comment_form.data("taskid"),
				taskdesc: $("#comment").val()
			};

			$.ajax({
				type: "post",
				url: "/submitComment",
				datatype: "json",
				data: data,
				success: function(data){
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					if(data.errMsg){
						window.alert(data.errMsg);
					}
				}
			});
		}

	};

	exports.submit = submit;

});
"use strict";
function Tab(option){
	this.tabHead = option.tabHead;
	this.tabBody = option.tabBody;

	var defaultOption = {
		headCurClass: "cur",
		bodyCurClass: "cur",
		headItem: "",
		bodyItem: "",
		beforeClick: function(){

		},
		callback:function(){

		}

	}

	this.option = $.extend(true,defaultOption,option);

	this.init();
}
Tab.prototype = {
	constructor: "Tab",
	init: function(){
		this.addLitener();
	},
	addLitener: function(){
		var that = this;
		var option = that.option;
		$("body").on("click",option.headItem,function(){
			if(typeof that.option.beforeClick === "function"){
				that.option.beforeClick();
			}
			that.click(this);
		});

	},
	click: function(clickItem){
		var $clickItem = $(clickItem)
		var index = $(this.tabHead).find(this.option.headItem).index($clickItem);
		var $bodyItem = $(this.tabBody).find(this.option.bodyItem).eq(index);
		$clickItem.addClass(this.option.headCurClass).siblings().removeClass(this.option.headCurClass);
		$bodyItem.addClass(this.option.bodyCurClass).siblings().removeClass(this.option.bodyCurClass);

		if(typeof this.option.callback === "function"){
			this.option.callback.call();
		}

	}
}