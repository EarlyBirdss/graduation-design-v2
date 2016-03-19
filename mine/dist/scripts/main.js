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
	var submit = require("/src/scripts/submit").submit;
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
			$(".J_new_pop").hide();
			$(".J_new_project_pop").slideDown("fast");

		}).on("click",".J_new_team",function(){
			//新建团队
			$(".J_new_pop").hide();
			$(".J_new_team_pop").slideDown("fast");

		}).on("click",".J_new_cle",function(){
			//新建取消按钮
			$(this).parents(".new-pop").slideUp("fast");

		}).on("click",".J_btn_new_project",function(){
			//新建项目确定按钮
			submit.newProject($(this));

		}).on("click",".J_btn_new_team",function(){
			//新建团队确定按钮
			submit.newTeam($(this));

		}).on("click",".J_team_manage",function(){
			//团队管理
			renderSection($(this).data("type"));

		}).on("click",".J_user_exit",function(){
			//退出当前登录
			console.log(submit);
			submit.userExit($(this));

		});

		//aside
		$("#J_aside").on("click",".a-list",function(){
			var $this = $(this);
			$this.addClass("cur").siblings().removeClass("cur");
			renderSection($this.data("type"));
		});


	}

	function initTab(){
		// 工作台
		new Tab({
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
	}

	function renderSection(type){
		$.ajax({
			type: "get",
			data: {type: type},
			url:"/getSection",
			success: function(data){
				console.log(data);
				$(".section").replaceWith(data);
			}
		});
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
					console.log(data);
					if(data.success === "F"){
						window.alert(data.errMsg);
					}
				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		}
	}

});
seajs.use('./js/second',function(s)
{
	s.show();
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
			window.alert("请输入完整注册信息");
		}else{
			$.ajax({
				url:"/submitRegister",
				type:"post",
				data: data,
				success: function(data){
					console.log(data);
					if(data.success === "F"){
						window.alert(data.errMsg);
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
		newProject: function($this){
			//新建项目
			console.log("newProject",$this);
		},
		newTeam: function($this){
			//新建团队
			console.log("newTeam",$this);
		},
		userExit: function($this){
			//退出当前用户
			console.log("userExit",$this);
			$.ajax({
				type: "post",
				url: "/submitLogout",
				success: function(data) {
					if(data.success === "F"){
						window.alert(data.errMsg);
					}
				},
				error: function(data){
					window.alert(data.errMsg);
				}
			})
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
			that.changeTab(this);
		});

	},
	changeTab: function(clickItem){
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