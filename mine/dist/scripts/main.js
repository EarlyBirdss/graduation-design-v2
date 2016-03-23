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
define(function  (require, exports, module) { 

	"use strict";
	// var submit = seajs.use("submit");
	console.log(require("/src/scripts/submit"));
	var submit = require("/src/scripts/submit").submit;
	var layer = require("/plugin/layer/layer");
	init();

	function init(){
		initTab();
		addListener();
	}

	function addListener(){

		//topbar
		$("#J_header").on("click",".J_new",function(){
			//新建
			$(".J_new_pop").slideToggle("fast");

		}).on("click",".J_msg",function(){
			//消息
			renderSection($(this).data("type"));

		}).on("click",".J_user",function(){
			//用户可操作条
			$(".J_user_pop").slideToggle("fast");

		}).on("click",".J_new_project",function(){
			//新建项目
			// $(".J_new_pop").hide();
			$(".J_new_project_pop").slideDown("fast");

		}).on("click",".J_new_team",function(){
			//新建团队
			// $(".J_new_pop").hide();
			$(".J_new_team_pop").slideDown("fast");

		}).on("click",".J_new_cle",function(){
			//新建取消按钮
			$(this).parents(".new-pop").slideUp("fast");

		}).on("click",".J_btn_new_project",function(){
			//新建项目确定按钮
			submit.newProject($(this), function(data) {
				$("#J_header .J_new_cle").trigger("click");
				renderSection("tasList",data);
			});

		}).on("click",".J_btn_new_team",function(){
			//新建团队确定按钮
			submit.newTeam($(this),function(data){
				$("#J_header .J_new_cle").trigger("click");
				renderSection("team",data);
			});

		}).on("click",".J_team_manage",function(data){
			//团队管理
			renderSection($(this).data("type"),data);

		}).on("click",".J_user_exit",function(){
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

		$("#J_task_detail").on("click",".J_close_pop",function(){
			//关闭任务详情滑窗
			slideInTaskDetail();
		});

		$("#article").on("click",".event-itm",function(){
			//
			slideOutTaskDetail();
		}).on("click",".ws-2-item",function(){
			//
			slideOutTaskDetail($(this));
		}).on("click",".ws-2-item",function(){
			//
			slideOutTaskDetail($(this));
		}).on("click",".J_project_item",function(){
			//加载项目详情 =>tasklist
			renderSection($(this).data("type"),function(){

			});
		}).on("click", ".J_new_task_btn", function(){

			$(this).hide().parents(".task-box").find(".form").slideDown();

		}).on("click",".J_new_task_cfm", function(){
			//新建任务确定按钮
			submit.newTask($(this),function(){
				$(this).parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
			});
		}).on("click", ".J_new_task_cle", function(){

			//新建任务取消按钮
			$(this).parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
		}).on("click", ".J_task_fanish_btn",function(){
			//完成任务按钮

			submit.finishTask($(this));
		});





		//aside Tab
		$("#J_aside").on("click",".a-list",function(){
			var $this = $(this);
			$this.addClass("cur").siblings().removeClass("cur");
			renderSection($this.data("type"));
		});


	}

	function initTab(){
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
			beforeClick: function(){
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

	function renderSection(type,data){
		$.ajax({
			type: "get",
			data: {type: type,data: data},
			url:"/getSection",
			success: function(data){
				$(".section").replaceWith(data);
			}
		});
	}

	function slideOutTaskDetail(){

		$("#J_task_detail").animate({
			width: "55%"
		},1000);
	}

	function slideInTaskDetail($this){
		//TODO 后台获取数据

		$("#J_task_detail").animate({
			width: "0"
		},1000);
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
						window.alert(data.message);
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

	var submit = {
		newProject: function($this,callback){
			//新建项目
			var data = {
				projectname: $("#projectname").val(),
				teamname: $("#projectower").val()
			};

			if(!data.projectname){
				layer.alert("请填写项目名称");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/submitNewProject",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						layer.alert(data.errMsg);
					}else{
						if(typeof callback === "function"){
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					layer.alert(data.errMsg);
				}
			});
		},
		newTeam: function($this,callback){
			//新建团队

			var data = {
				teamname: $("#teamname").val(),
				teamdesc: $("#teamdesc").val()
			};

			if(!data.teamname){
				layer.alert("请填写团队名称");
				return false;
			}
			
			$.ajax({
				type: "post",
				url: "/submitNewTeam",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						layer.alert(data.errMsg);
					}else{
						if(typeof callback === "function"){
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					layer.alert(data.errMsg);
				}
			});
		},
		userExit: function($this){
			//退出当前用户
			$.ajax({
				type: "post",
				url: "/submitLogout",
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						window.alert(data.message);
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		},
		quitTeam: function($this){
			$.ajax({
				type: "post",
				url: "/submitQuitTeam",
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						window.alert(data.message);
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		},
		newTask: function($this,callback) {
			var projectTitle = $this.parents(".J_project_title");
			var data = {
				teamname: projectTitle.data("teamname"),
				projectname: projectTitle.data("projectname"),
				taskname: $("#task").val()
			};
			console.log(data);

			$.ajax({
				type: "post",
				url: "/submitNewTask",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						if(typeof callback === "function") {
							callback.call(null,data.data);
						}
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		},
		finishTask: function($this, callback) {

			var projectTitle = $this.parents(".J_project_title");

			var data = {
				teamname: projectTitle.data("teamname"),
				projectname: projectTitle.data("projectname"),
				taskname: $this.next(".J_task_title").html()
			};

			$.ajax({
				type: "post",
				url: "/submitFinishTask",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						if(typeof callback === "function") {
							callback.call(null,data.data);
						}
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		}

	}

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